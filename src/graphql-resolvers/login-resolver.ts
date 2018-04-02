import jwt from "jsonwebtoken";
import Knex from "knex";
import AvatarService from "services/avatar-service";
import FacebookService, {
  FacebookError,
  IFacebookErrorResponse,
  IFacebookTokenInfo,
  IFacebookUser
} from "services/facebook-service";
import UserService from "services/user-service";
import { IEnvConfig } from "utils/env-config";
import IGraphqlContext from "utils/graphql-context";
import { makeLog } from "utils/log";

interface IArgs {
  facebookAccessToken: string;
}

const log = makeLog("login-resolver");

async function loginResolver(
  parentResult: any,
  args: IArgs,
  context: IGraphqlContext
) {
  const {
    facebookService,
    userService,
    avatarService,
    friendSynchronizer,
    envConfig,
    db
  } = context.diContainer;
  const { facebookAccessToken } = args;
  const facebookUser = await facebookService.getUser(facebookAccessToken);
  let user = await userService.getByFacebookId(facebookUser.id);
  const isNewUser = !user;

  await db.transaction(async transaction => {
    if (user) {
      await userService.setFacebookAccessToken(
        user.id,
        facebookAccessToken,
        transaction
      );
    } else {
      user = await addUser(
        facebookUser,
        facebookAccessToken,
        userService,
        facebookService,
        avatarService,
        transaction
      );
    }
  });

  friendSynchronizer.sync(user!.id, facebookAccessToken);
  const accessToken = await makeAccessToken(
    user!.id,
    envConfig,
    facebookAccessToken,
    facebookService
  );
  return {
    accessToken,
    isNewUser,
    user
  };
}

async function addUser(
  facebookUser: IFacebookUser,
  facebookAccessToken: string,
  userService: UserService,
  facebookService: FacebookService,
  avatarService: AvatarService,
  transaction: Knex.Transaction
) {
  let pictureSize = 48;
  const facebookPictureSmall = await facebookService.getUserPicture(
    facebookAccessToken,
    pictureSize
  );
  pictureSize = 256;
  const facebookPictureMedium = await facebookService.getUserPicture(
    facebookAccessToken,
    pictureSize
  );
  const avatar = await avatarService.add({
    urlMedium: facebookPictureMedium.url,
    urlSmall: facebookPictureSmall.url
  });
  return await userService.add(
    {
      avatarId: avatar.id,
      facebookAccessToken,
      facebookId: facebookUser.id,
      name: facebookUser.name
    },
    transaction
  );
}

async function makeAccessToken(
  userId: string,
  envConfig: IEnvConfig,
  facebookAccessToken: string,
  facebookService: FacebookService
) {
  const facebookTokenInfo = await facebookService.getTokenInfo(
    facebookAccessToken
  );
  return jwt.sign(
    {
      exp: facebookTokenInfo.expires_at,
      id: userId
    },
    envConfig.secret
  );
}

export default loginResolver;
