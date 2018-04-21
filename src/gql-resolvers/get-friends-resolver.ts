import IGqlContext from "utils/gql-context";

interface IArgs {
  after?: number;
}

function getFriendsResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  // TODO
}

export default getFriendsResolver;
