import { IUser } from "models/user";
import IGqlContext from "utils/gql-context";
import isIdEqual from "utils/is-id-equal";

const userResolver = {
  avatarUrlMedium,
  avatarUrlSmall,
  isMuted,
  isReported,
  rewardableReviewsLeft
};

function rewardableReviewsLeft(
  user: IUser,
  args: object,
  context: IGqlContext
) {
  return isIdEqual(context.session && context.session.userId, user.id)
    ? user.rewardableReviewsLeft
    : 0;
}

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
  const viewerId = session && session.userId;

  if (!viewerId) {
    return false;
  }

  return (await diContainer.userReportFetcher.get(user.id, viewerId)) != null;
}

async function isMuted(user: IUser, args: object, context: IGqlContext) {
  const { diContainer, session } = context;
  const viewerId = session && session.userId;

  if (!viewerId) {
    return false;
  }

  return (await diContainer.muteFetcher.get(user.id, viewerId)) != null;
}

export default userResolver;
