import { combineResolvers } from "graphql-resolvers";
import Knex from "knex";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import { IValidationResult } from "utils/validation-result";

function makeAddTrackableResolver<TArgs, TInput, TOutput>(
  argsToInput: (args: TArgs, context: IGqlContext) => Promise<TInput>,
  addTrackable: (
    input: TInput,
    transaction: Knex.Transaction,
    context: IGqlContext
  ) => Promise<TOutput>,
  mapValidationErrors: (validationResult: IValidationResult) => void
) {
  return combineResolvers(
    makeCheckAuthResolver(),
    async (parentResult: any, args: TArgs, context: IGqlContext) => {
      const { db } = context.diContainer;
      const input = await argsToInput(args, context);
      const output = await db.transaction(async transaction => {
        try {
          return await addTrackable(input, transaction, context);
        } catch (e) {
          if (e instanceof ConstraintViolationError) {
            mapValidationErrors(e.validationResult);
          }

          throw e;
        }
      });
      return {
        trackable: output
      };
    }
  );
}

export { makeAddTrackableResolver };
