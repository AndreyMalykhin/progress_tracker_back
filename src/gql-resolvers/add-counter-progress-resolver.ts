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
  value: number;
}

async function addCounterProgressResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = {
    [isClientId(args.id) ? "clientId" : "id"]: args.id,
    progressDelta: args.value,
    userId: context.session!.userId
  };
  const trackable = await context.diContainer.db.transaction(
    async transaction => {
      try {
        return await context.diContainer.addCounterProgressCmd(
          input,
          transaction
        );
      } catch (e) {
        if (e instanceof ConstraintViolationError) {
          mapErrors(e.validationResult, {
            clientId: { field: "id" },
            progressDelta: { field: "value" }
          });
        }

        throw e;
      }
    }
  );
  return { trackable };
}

export default combineResolvers(
  makeCheckAuthResolver(),
  addCounterProgressResolver
);
