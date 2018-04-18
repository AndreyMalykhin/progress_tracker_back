import { combineResolvers } from "graphql-resolvers";
import Audience from "models/audience";
import { makeConnection } from "utils/connection";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";

interface IArgs {
  audience: Audience.Me | Audience.Friends;
  after?: number;
}

async function getActivitiesResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { activityFetcher } = context.diContainer;
  const viewerId = context.session!.userId;
  const activities = await activityFetcher.getByAudience(
    args.audience,
    viewerId,
    args.after ? new Date(args.after) : undefined
  );
  return makeConnection(
    activities,
    activity => activity.date,
    endCursor => {
      const limit = 1;
      return activityFetcher.getByAudience(
        args.audience,
        viewerId,
        endCursor,
        limit
      );
    }
  );
}

export default combineResolvers(makeCheckAuthResolver(), getActivitiesResolver);
