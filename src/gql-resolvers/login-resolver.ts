import IGqlContext from "utils/gql-context";

interface IArgs {
  facebookAccessToken: string;
}

async function loginResolver(
  parentResult: any,
  args: IArgs,
  context: IGqlContext
) {
  return context.diContainer.db.transaction(
    async transaction =>
      await context.diContainer.loginCmd(args.facebookAccessToken, transaction)
  );
}

export default loginResolver;
