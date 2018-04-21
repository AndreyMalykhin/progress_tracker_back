import { combineResolvers } from "graphql-resolvers";
import { TrackableStatus } from "models/trackable-status";
import { makeConnection } from "utils/connection";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";

interface IArgs {
  userId?: ID;
  after?: number;
}

async function getActiveTrackablesResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { trackableFetcher } = context.diContainer;
  const viewerId = context.session && context.session.userId;
  const ownerId = args.userId || viewerId;
  const limit = 8;
  const trackables = await trackableFetcher.getActive(
    ownerId!,
    args.after,
    viewerId,
    limit + 1
  );
  return makeConnection(trackables, trackable => trackable.order, limit);
}

export default combineResolvers(
  makeCheckAuthResolver((parentValue, args: IArgs) => !args.userId),
  getActiveTrackablesResolver
);
