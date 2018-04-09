import { IUser } from "models/user";
import IGqlContext from "utils/gql-context";

const userResolver = {
  avatarUrlMedium,
  avatarUrlSmall,
  isMuted,
  isReported
};

async function avatarUrlSmall(user: IUser, args: object, context: IGqlContext) {
  const avatar = await context.loaderMap.avatar.load(user.avatarId);
  return avatar.urlSmall;
}

async function avatarUrlMedium(
  user: IUser,
  args: object,
  context: IGqlContext
) {
  const avatar = await context.loaderMap.avatar.load(user.avatarId);
  return avatar.urlMedium;
}

async function isReported(user: IUser, args: object, context: IGqlContext) {
  const { diContainer, session } = context;
  const report = await diContainer.userReportFetcher.get(
    user.id,
    session && session.userId
  );
  return report != null;
}

async function isMuted(user: IUser, args: object, context: IGqlContext) {
  const { diContainer, session } = context;
  const mute = await diContainer.muteFetcher.get(
    user.id,
    session && session.userId
  );
  return mute != null;
}

export default userResolver;
