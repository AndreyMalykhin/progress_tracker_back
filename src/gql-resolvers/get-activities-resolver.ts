import { combineResolvers } from "graphql-resolvers";
import Audience from "models/audience";
import { makeConnection } from "utils/connection";
import { cursorToStr, strToDateCursor } from "utils/db-cursor";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";

interface IArgs {
  audience: Audience.Me | Audience.Friends;
  after?: string;
}

async function getActivitiesResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { activityFetcher } = context.diContainer;
  const viewerId = context.session!.userId;
  const limit = 16;
  const activities = await activityFetcher.getByAudience(
    args.audience,
    viewerId,
    strToDateCursor(args.after),
    limit + 1
  );
  return makeConnection(
    activities,
    activity => cursorToStr({ value: activity.date, id: activity.id }),
    limit
  );
}

export default combineResolvers(makeCheckAuthResolver(), getActivitiesResolver);
