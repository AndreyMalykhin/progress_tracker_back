import { combineResolvers } from "graphql-resolvers";
import { TrackableStatus } from "models/trackable-status";
import TrackableFetcher from "services/trackable-fetcher";
import { makeConnection } from "utils/connection";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";

interface IArgs {
  status:
    | TrackableStatus.Approved
    | TrackableStatus.Rejected
    | TrackableStatus.Expired;
  userId?: ID;
  after?: number;
}

async function getArchivedTrackablesResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { trackableFetcher } = context.diContainer;
  const viewerId = context.session && context.session.userId;
  const ownerId = args.userId || viewerId;
  const trackables = await trackableFetcher.getArchived(
    ownerId!,
    args.status,
    args.after ? new Date(args.after) : undefined,
    viewerId
  );
  return makeConnection(
    trackables,
    trackable => trackable.statusChangeDate,
    endCursor => {
      const limit = 1;
      return trackableFetcher.getArchived(
        ownerId!,
        args.status,
        endCursor,
        viewerId,
        limit
      );
    }
  );
}

export default combineResolvers(
  makeCheckAuthResolver((parentValue, args: IArgs) => !args.userId),
  getArchivedTrackablesResolver
);
