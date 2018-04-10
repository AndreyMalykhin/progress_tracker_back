import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import { mapErrors } from "utils/validation-result";
import { isUUID } from "validator";

interface IArgs {
  ids: ID[];
  aggregateId: ID;
}

async function addToAggregateResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { ids, aggregateId } = args;
  const children: Array<{ id?: ID; clientId?: ID }> = [];

  for (const id of ids) {
    if (isUUID(id)) {
      children.push({ clientId: id });
    } else {
      children.push({ id });
    }
  }

  let aggregate: { id?: ID; clientId?: ID };

  if (isUUID(aggregateId)) {
    aggregate = { clientId: aggregateId };
  } else {
    aggregate = { id: aggregateId };
  }

  const trackable = await context.diContainer.db.transaction(
    async transaction => {
      try {
        return await context.diContainer.addToAggregateCmd(
          children,
          aggregate,
          context.session!.userId,
          transaction
        );
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
