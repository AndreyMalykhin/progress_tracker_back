import { combineResolvers } from "graphql-resolvers";
import Audience from "models/audience";
import UserFetcher from "services/user-fetcher";
import { makeConnection } from "utils/connection";
import { cursorToStr, IDbCursor, strToNumberCursor } from "utils/db-cursor";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";

interface IArgs {
  audience: Audience.Friends | Audience.Global;
  after?: string;
}

async function getLeadersResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { userFetcher } = context.diContainer;
  const viewerId = context.session && context.session.userId;
  const users = await userFetcher.getLeaders(
    args.audience,
    viewerId,
    strToNumberCursor(args.after)
  );
  return makeConnection(
    users,
    user => cursorToStr({ value: user.rating, id: user.id }),
    endCursor => {
      const limit = 1;
      return userFetcher.getLeaders(
        args.audience,
        viewerId,
        strToNumberCursor(endCursor),
        limit
      );
    }
  );
}

export default combineResolvers(
  makeCheckAuthResolver(
    (parentValue, args: IArgs) => args.audience !== Audience.Global
  ),
  getLeadersResolver
);
