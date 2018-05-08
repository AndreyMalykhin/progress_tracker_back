import { combineResolvers } from "graphql-resolvers";
import { makeConnection } from "utils/connection";
import { cursorToStr, strToStringCursor } from "utils/db-cursor";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";

interface IArgs {
  after?: string;
}

async function getFriendsResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { userFetcher } = context.diContainer;
  const viewerId = context.session!.userId;
  const limit = 16;
  const users = await userFetcher.getFriends(
    viewerId,
    strToStringCursor(args.after),
    limit + 1
  );
  return makeConnection(
    users,
    user => cursorToStr({ value: user.name, id: user.id }),
    limit
  );
}

export default combineResolvers(makeCheckAuthResolver(), getFriendsResolver);
