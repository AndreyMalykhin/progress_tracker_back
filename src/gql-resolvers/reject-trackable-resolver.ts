import { combineResolvers } from "graphql-resolvers";
import RejectReason from "models/reject-reason";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  id: ID | UUID;
  reason: RejectReason;
}

function rejectTrackableResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = {
    [isClientId(args.id) ? "clientId" : "id"]: args.id,
    reasonId: args.reason,
    userId: context.session!.userId
  };
  return context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.rejectTrackableCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          clientId: { field: "id" },
          reasonId: { field: "reason" }
        });
      }

      throw e;
    }
  });
}

export default combineResolvers(
  makeCheckAuthResolver(),
  rejectTrackableResolver
);
