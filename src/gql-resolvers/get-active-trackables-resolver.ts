import { combineResolvers } from "graphql-resolvers";
import { TrackableStatus } from "models/trackable-status";
import { makeConnection } from "utils/connection";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import IGraphqlContext from "utils/graphql-context";
import ID from "utils/id";

interface IArgs {
  userId?: ID;
  after?: number;
}

async function getActiveTrackablesResolver(
  parentValue: any,
  args: IArgs,
  context: IGraphqlContext
) {
  const { trackableService } = context.diContainer;
  const viewerId = context.session && context.session.userId;
  const ownerId = args.userId || viewerId;
  const trackables = await trackableService.getActive(
    ownerId!,
    args.after,
    viewerId
  );
  return makeConnection(
    trackables,
    trackable => trackable.order,
    endCursor => {
      const limit = 1;
      return trackableService.getActive(ownerId!, endCursor, viewerId, limit);
    }
  );
}

export default combineResolvers(
  makeCheckAuthResolver((parentValue, args: IArgs) => !args.userId),
  getActiveTrackablesResolver
);
