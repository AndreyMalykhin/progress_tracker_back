import { IUser } from "models/user";
import IGraphqlContext from "utils/graphql-context";

const userResolver = {
  avatarUrlMedium,
  avatarUrlSmall,
  isMuted,
  isReported
};

async function avatarUrlSmall(
  user: IUser,
  args: object,
  context: IGraphqlContext
) {
  const avatar = await context.loaderMap.avatar.load(user.avatarId);
  return avatar.urlSmall;
}

async function avatarUrlMedium(
  user: IUser,
  args: object,
  context: IGraphqlContext
) {
  const avatar = await context.loaderMap.avatar.load(user.avatarId);
  return avatar.urlMedium;
}

async function isReported(user: IUser, args: object, context: IGraphqlContext) {
  const { diContainer, session } = context;
  const report = await diContainer.userService.getReport(
    user.id,
    session && session.userId
  );
  return report != null;
}

async function isMuted(user: IUser, args: object, context: IGraphqlContext) {
  const { diContainer, session } = context;
  const mute = await diContainer.userService.getMute(
    user.id,
    session && session.userId
  );
  return mute != null;
}

export default userResolver;
