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
  assetId: ID | UUID;
}

function proveTrackableResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = {
    [isClientId(args.id) ? "clientId" : "id"]: args.id,
    asset: { [isClientId(args.assetId) ? "clientId" : "id"]: args.assetId },
    userId: context.session!.userId
  };
  return context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.proveTrackableCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          asset: { field: "assetId" },
          clientId: { field: "id" }
        });
      }

      throw e;
    }
  });
}

export default combineResolvers(
  makeCheckAuthResolver(),
  proveTrackableResolver
);
