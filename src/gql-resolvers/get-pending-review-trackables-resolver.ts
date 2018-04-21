import { combineResolvers } from "graphql-resolvers";
import Audience from "models/audience";
import { makeConnection } from "utils/connection";
import { cursorToStr, strToDateCursor } from "utils/db-cursor";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";

interface IArgs {
  audience: Audience;
  after?: string;
}

async function getPendingReviewTrackablesResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { trackableFetcher } = context.diContainer;
  const viewerId = context.session && context.session.userId;
  const limit = 8;
  const trackables = await trackableFetcher.getPendingReview(
    args.audience,
    strToDateCursor(args.after),
    viewerId,
    limit + 1
  );
  return makeConnection(
    trackables,
    trackable =>
      cursorToStr({ value: trackable.statusChangeDate!, id: trackable.id }),
    limit
  );
}

export default combineResolvers(
  makeCheckAuthResolver(
    (parentValue, args: IArgs) => args.audience !== Audience.Global
  ),
  getPendingReviewTrackablesResolver
);
