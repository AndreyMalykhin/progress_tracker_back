import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  task: {
    id: ID | UUID;
    title: string;
  };
}

async function editTaskResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { task } = args;
  const input = {
    title: task.title,
    [isClientId(task.id) ? "clientId" : "id"]: task.id,
    userId: context.session!.userId
  };
  const output = await context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.editTaskCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          clientId: { field: "id" }
        });
      }

      throw e;
    }
  });
  return { task: output };
}

export default combineResolvers(makeCheckAuthResolver(), editTaskResolver);
