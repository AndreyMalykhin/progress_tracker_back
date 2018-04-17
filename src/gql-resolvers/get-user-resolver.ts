import IGqlContext from "utils/gql-context";
import ID from "utils/id";

interface IArgs {
  id: ID;
}

function getUserResolver(parentValue: any, args: IArgs, context: IGqlContext) {
  return context.loaderMap.user.load(args.id);
}

export default getUserResolver;
