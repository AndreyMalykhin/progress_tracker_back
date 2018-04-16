import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  ids: Array<ID | UUID>;
  aggregateId: ID | UUID;
}

async function addToAggregateResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { ids: childIds, aggregateId } = args;
  const children: Array<{ id?: ID; clientId?: UUID }> = [];

  for (const id of childIds) {
    if (isClientId(id)) {
      children.push({ clientId: id });
    } else {
      children.push({ id });
    }
  }

  const input = {
    aggregate: { [isClientId(aggregateId) ? "clientId" : "id"]: aggregateId },
    children,
    userId: context.session!.userId
  };
  const trackable = await context.diContainer.db.transaction(
    async transaction => {
      try {
        return await context.diContainer.addToAggregateCmd(input, transaction);
      } catch (e) {
        if (e instanceof ConstraintViolationError) {
          mapErrors(e.validationResult, {
            aggregate: { field: "aggregateId" },
            children: { field: "ids" }
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
  addToAggregateResolver
);
