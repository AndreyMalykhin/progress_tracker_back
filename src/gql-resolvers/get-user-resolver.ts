import { combineResolvers } from "graphql-resolvers";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";

interface IArgs {
  id?: ID;
}

function getUserResolver(parentValue: any, args: IArgs, context: IGqlContext) {
  return context.loaderMap.user.load(args.id || context.session!.userId);
}

export default combineResolvers(
  makeCheckAuthResolver((parentValue, args: IArgs) => !args.id),
  getUserResolver
);
