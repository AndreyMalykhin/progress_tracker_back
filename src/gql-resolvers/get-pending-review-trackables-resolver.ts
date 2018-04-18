import { combineResolvers } from "graphql-resolvers";
import Audience from "models/audience";
import { makeConnection } from "utils/connection";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";

interface IArgs {
  audience: Audience;
  after?: number;
}

async function getPendingReviewTrackablesResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { trackableFetcher } = context.diContainer;
  const viewerId = context.session && context.session.userId;
  const trackables = await trackableFetcher.getPendingReview(
    args.audience,
    args.after ? new Date(args.after) : undefined,
    viewerId
  );
  return makeConnection(
    trackables,
    trackable => trackable.statusChangeDate,
    endCursor => {
      const limit = 1;
      return trackableFetcher.getPendingReview(
        args.audience,
        endCursor,
        viewerId,
        limit
      );
    }
  );
}

export default combineResolvers(
  makeCheckAuthResolver(
    (parentValue, args: IArgs) => args.audience !== Audience.Global
  ),
  getPendingReviewTrackablesResolver
);
