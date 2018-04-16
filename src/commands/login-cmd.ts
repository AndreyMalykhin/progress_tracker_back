import { IAddAvatarCmd } from "commands/add-avatar-cmd";
import { ISyncFriendsCmd } from "commands/sync-friends-cmd";
import Knex from "knex";
import { IUser, rewardableReviewsPerDay } from "models/user";
import AccessTokenIssuer from "services/access-token-issuer";
import Facebook, { IFacebookUser } from "services/facebook";
import UserFetcher from "services/user-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";
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
  syncFriendsCmd: ISyncFriendsCmd,
  addAvatarCmd: IAddAvatarCmd
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
        transaction,
        addAvatarCmd
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
  transaction: Knex.Transaction,
  addAvatarCmd: IAddAvatarCmd
) {
  let pictureSize = 48;
  const facebookPictureSmall = await facebook.getUserPicture(
    facebookAccessToken,
    pictureSize
  );
  pictureSize = 256;
  const facebookPictureMedium = await facebook.getUserPicture(
    facebookAccessToken,
    pictureSize
  );
  const avatar = await addAvatarCmd(
    {
      urlMedium: facebookPictureMedium.url,
      urlSmall: facebookPictureSmall.url
    },
    transaction
  );
  const user = {
    avatarId: avatar.id,
    facebookAccessToken,
    facebookId: facebookUser.id,
    name: facebookUser.name,
    rewardableReviewsLeft: rewardableReviewsPerDay
  } as IUser;
  const rows = await db(DbTable.Users)
    .transacting(transaction)
    .insert(user, "*");
  return rows[0];
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
