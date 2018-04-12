import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  entry: {
    gymExerciseId: ID | UUID;
    id?: UUID;
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
  const gymExercise = isClientId(gymExerciseId)
    ? { clientId: gymExerciseId }
    : { id: gymExerciseId };
  const input = {
    clientId,
    gymExercise,
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
          clientId: { field: "id" },
          gymExercise: { field: "gymExerciseId" }
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
