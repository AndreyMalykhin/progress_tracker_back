import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  sourceId: ID | UUID;
  destinationId: ID | UUID;
}

async function reorderTrackableResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = {
    destination: {
      [isClientId(args.destinationId) ? "clientId" : "id"]: args.destinationId
    },
    source: { [isClientId(args.sourceId) ? "clientId" : "id"]: args.sourceId },
    userId: context.session!.userId
  };
  const trackable = await context.diContainer.db.transaction(
    async transaction => {
      try {
        return await context.diContainer.reorderTrackableCmd(
          input,
          transaction
        );
      } catch (e) {
        if (e instanceof ConstraintViolationError) {
          mapErrors(e.validationResult, {
            destination: { field: "destinationId" },
            source: { field: "sourceId" }
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
  reorderTrackableResolver
);
