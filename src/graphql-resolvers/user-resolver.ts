import { IUser } from "models/user";
import IGraphqlContext from "utils/graphql-context";

const userResolver = {
  avatarUrlMedium,
  avatarUrlSmall,
  isMuted,
  isReported,
  rewardableReviewsLeft
};

async function avatarUrlSmall(
  user: IUser,
  args: undefined,
  context: IGraphqlContext
) {
  const avatar = await context.diContainer.avatarService.getById(user.avatarId);
  return avatar.urlSmall;
}

async function avatarUrlMedium(
  user: IUser,
  args: undefined,
  context: IGraphqlContext
) {
  const avatar = await context.diContainer.avatarService.getById(user.avatarId);
  return avatar.urlMedium;
}

async function isReported(
  user: IUser,
  args: undefined,
  context: IGraphqlContext
) {
  // TODO
  return false;
}

async function isMuted(user: IUser, args: undefined, context: IGraphqlContext) {
  // TODO
  return false;
}

async function rewardableReviewsLeft(
  user: IUser,
  args: undefined,
  context: IGraphqlContext
) {
  // TODO
  return 4;
}

export default userResolver;
