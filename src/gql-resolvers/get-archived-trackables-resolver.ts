import { combineResolvers } from "graphql-resolvers";
import { TrackableStatus } from "models/trackable-status";
import TrackableFetcher from "services/trackable-fetcher";
import { makeConnection } from "utils/connection";
import { cursorToStr, strToDateCursor } from "utils/db-cursor";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";

interface IArgs {
  status:
    | TrackableStatus.Approved
    | TrackableStatus.Rejected
    | TrackableStatus.Expired;
  userId?: ID;
  after?: string;
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
    strToDateCursor(args.after),
    viewerId
  );
  return makeConnection(
    trackables,
    trackable =>
      cursorToStr({ value: trackable.statusChangeDate!, id: trackable.id }),
    endCursor => {
      const limit = 1;
      return trackableFetcher.getArchived(
        ownerId!,
        args.status,
        strToDateCursor(endCursor),
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
