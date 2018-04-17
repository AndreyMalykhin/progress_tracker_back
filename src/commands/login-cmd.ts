import { ISyncFriendsCmd } from "commands/sync-friends-cmd";
import setUserAvatarResolver from "gql-resolvers/set-user-avatar-resolver";
import Knex from "knex";
import { avatarSizes, defaultAvatarId, IAvatar } from "models/avatar";
import { IUser, rewardableReviewsPerDay } from "models/user";
import AccessTokenIssuer from "services/access-token-issuer";
import Facebook, { IFacebookUser } from "services/facebook";
import UserFetcher from "services/user-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";
import isIdEqual from "utils/is-id-equal";
import { makeLog } from "utils/log";

type ILoginCmd = (
  facebookAccessToken: string,
  transaction: Knex.Transaction
) => {
  accessToken: string;
  isNewUser: boolean;
  user: IUser;
};

const log = makeLog("login-cmd");

function makeLoginCmd(
  facebook: Facebook,
  userFetcher: UserFetcher,
  accessTokenIssuer: AccessTokenIssuer,
  db: Knex,
  syncFriendsCmd: ISyncFriendsCmd
) {
  return async (facebookAccessToken: string, transaction: Knex.Transaction) => {
    const facebookUser = await facebook.getUser(facebookAccessToken);
    let user = await userFetcher.getByFacebookId(facebookUser.id, transaction);
    const isNewUser = !user;

    if (user) {
      await setFacebookAccessToken(
        user.id,
        facebookAccessToken,
        db,
        transaction
      );
    } else {
      user = await addUser(
        facebookUser,
        facebookAccessToken,
        facebook,
        db,
        transaction
      );
    }

    syncFriendsCmd(user!.id, facebookAccessToken).catch(e =>
      log.error("makeLoginCmd", e)
    );
    const accessToken = await makeAccessToken(
      user!.id,
      facebookAccessToken,
      facebook,
      accessTokenIssuer
    );
    return {
      accessToken,
      isNewUser,
      user
    };
  };
}

async function setFacebookAccessToken(
  id: ID,
  token: string,
  db: Knex,
  transaction: Knex.Transaction
) {
  await db(DbTable.Users)
    .transacting(transaction)
    .update("facebookAccessToken", token)
    .where("id", id)
    .limit(1);
}

async function addUser(
  facebookUser: IFacebookUser,
  facebookAccessToken: string,
  facebook: Facebook,
  db: Knex,
  transaction: Knex.Transaction
) {
  const avatarId = await addAvatar(
    facebookAccessToken,
    facebook,
    db,
    transaction
  );
  const rows = await db(DbTable.Users)
    .transacting(transaction)
    .insert(
      {
        avatarId,
        facebookAccessToken,
        facebookId: facebookUser.id,
        name: facebookUser.name,
        rewardableReviewsLeft: rewardableReviewsPerDay
      } as IUser,
      "*"
    );
  const user = rows[0];

  if (!isIdEqual(avatarId, defaultAvatarId)) {
    await updateAvatar(avatarId, user.id, db, transaction);
  }

  return user;
}

async function updateAvatar(
  avatarId: ID,
  userId: ID,
  db: Knex,
  transaction: Knex.Transaction
) {
  await db(DbTable.Avatars)
    .transacting(transaction)
    .update("userId", userId)
    .where("id", avatarId);
}

async function addAvatar(
  facebookAccessToken: string,
  facebook: Facebook,
  db: Knex,
  transaction: Knex.Transaction
) {
  const [facebookPictureSmall, facebookPictureMedium] = await Promise.all([
    facebook.getUserPicture(facebookAccessToken, avatarSizes.small),
    facebook.getUserPicture(facebookAccessToken, avatarSizes.medium)
  ]);
  let avatarId = defaultAvatarId;

  if (
    !facebookPictureSmall.is_silhouette &&
    !facebookPictureMedium.is_silhouette
  ) {
    const rows = await db(DbTable.Avatars)
      .transacting(transaction)
      .insert(
        {
          urlMedium: facebookPictureMedium.url,
          urlSmall: facebookPictureSmall.url
        } as IAvatar,
        "*"
      );
    avatarId = rows[0].id;
  }

  return avatarId;
}

async function makeAccessToken(
  userId: ID,
  facebookAccessToken: string,
  facebook: Facebook,
  accessTokenIssuer: AccessTokenIssuer
) {
  const facebookTokenInfo = await facebook.getTokenInfo(facebookAccessToken);
  return await accessTokenIssuer.sign(facebookTokenInfo.expires_at, userId);
}

export { makeLoginCmd, ILoginCmd };
