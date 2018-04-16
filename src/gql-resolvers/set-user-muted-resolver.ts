import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  id: ID;
  isMuted: boolean;
}

async function setUserMutedResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = {
    isMuted: args.isMuted,
    srcId: context.session!.userId,
    targetId: args.id
  };
  const user = await context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.setUserMutedCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          targetId: { field: "id" }
        });
      }

      throw e;
    }
  });
  return { user };
}

export default combineResolvers(makeCheckAuthResolver(), setUserMutedResolver);
