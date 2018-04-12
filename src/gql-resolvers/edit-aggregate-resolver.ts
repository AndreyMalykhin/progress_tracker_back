import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  aggregate: {
    id: ID | UUID;
    title: string;
  };
}

async function editAggregateResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { aggregate } = args;
  const input = {
    title: aggregate.title,
    [isClientId(aggregate.id) ? "clientId" : "id"]: aggregate.id,
    userId: context.session!.userId
  };
  const trackable = await context.diContainer.db.transaction(
    async transaction => {
      try {
        return await context.diContainer.editAggregateCmd(input, transaction);
      } catch (e) {
        if (e instanceof ConstraintViolationError) {
          mapErrors(e.validationResult, {
            clientId: { field: "id" }
          });
        }

        throw e;
      }
    }
  );
  return { trackable };
}

export default combineResolvers(makeCheckAuthResolver(), editAggregateResolver);
