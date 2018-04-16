import { combineResolvers } from "graphql-resolvers";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";

interface IArgs {
  user: {
    name: string;
  };
}

async function editUserResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = { id: context.session!.userId, name: args.user.name };
  const user = await context.diContainer.db.transaction(transaction =>
    context.diContainer.editUserCmd(input, transaction)
  );
  return { user };
}

export default combineResolvers(makeCheckAuthResolver(), editUserResolver);
