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
}

async function breakAggregateResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { id } = args;
  const aggregate = isClientId(id) ? { clientId: id } : { id };
  const trackables = await context.diContainer.db.transaction(
    async transaction => {
      try {
        return await context.diContainer.breakAggregateCmd(
          aggregate,
          context.session!.userId,
          transaction
        );
      } catch (e) {
        if (e instanceof ConstraintViolationError) {
          mapErrors(e.validationResult, {
            aggregate: { field: "id" }
          });
        }

        throw e;
      }
    }
  );
  return { trackables };
}

export default combineResolvers(
  makeCheckAuthResolver(),
  breakAggregateResolver
);
