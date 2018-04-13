import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  id: ID | UUID;
  isDone: boolean;
}

async function setTaskDoneResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = {
    [isClientId(args.id) ? "clientId" : "id"]: args.id,
    isDone: args.isDone,
    userId: context.session!.userId
  };
  const task = context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.setTaskDoneCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          clientId: { field: "id" }
        });
      }

      throw e;
    }
  });
  return { task };
}

export default combineResolvers(makeCheckAuthResolver(), setTaskDoneResolver);
