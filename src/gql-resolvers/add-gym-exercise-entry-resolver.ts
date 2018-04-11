import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  entry: {
    gymExerciseId: ID;
    id?: ID;
    setCount: number;
    repetitionCount: number;
    weight: number;
  };
}

async function addGymExerciseEntryResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const {
    gymExerciseId,
    id: clientId,
    repetitionCount,
    weight,
    setCount
  } = args.entry;
  const input = {
    clientId,
    gymExerciseId,
    repetitionCount,
    setCount,
    userId: context.session!.userId,
    weight
  };
  const output = await context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.addGymExerciseEntryCmd(
        input,
        transaction
      );
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          clientId: { field: "id" }
        });
      }

      throw e;
    }
  });
  return { entry: output };
}

export default combineResolvers(
  makeCheckAuthResolver(),
  addGymExerciseEntryResolver
);
