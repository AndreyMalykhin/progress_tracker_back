import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  id: ID;
}

function unaggregateTrackableResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { id } = args;
  const trackable = isClientId(id) ? { clientId: id } : { id };
  return context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.unaggregateTrackableCmd(
        trackable,
        context.session!.userId,
        transaction
      );
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          trackable: { field: "id" }
        });
      }

      throw e;
    }
  });
}

export default combineResolvers(
  makeCheckAuthResolver(),
  unaggregateTrackableResolver
);
