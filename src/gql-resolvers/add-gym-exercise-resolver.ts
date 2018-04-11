import { IAddGymExerciseCmdInput } from "commands/add-gym-exercise-cmd";
import { makeAddTrackableResolver } from "gql-resolvers/add-trackable-resolver";
import Knex from "knex";
import IGqlContext from "utils/gql-context";
import ID from "utils/id";
import nonexistentId from "utils/nonexistent-id";
import { IValidationResult, mapErrors } from "utils/validation-result";

interface IArgs {
  gymExercise: {
    id?: ID;
    title: string;
    iconName: string;
    isPublic: boolean;
  };
}

const addGymExerciseResolver = makeAddTrackableResolver(
  argsToInput,
  addGymExercise,
  mapValidationErrors
);

function addGymExercise(
  input: IAddGymExerciseCmdInput,
  transaction: Knex.Transaction,
  context: IGqlContext
) {
  return context.diContainer.addGymExerciseCmd(input, transaction);
}

function mapValidationErrors(validationResult: IValidationResult) {
  mapErrors(validationResult, {
    clientId: { field: "id" },
    iconId: { field: "iconName" }
  });
}

async function argsToInput(args: IArgs, context: IGqlContext) {
  const { gymExercise } = args;
  const icon = await context.diContainer.iconFetcher.getByName(
    gymExercise.iconName
  );
  return {
    clientId: gymExercise.id,
    iconId: icon ? icon.id : nonexistentId,
    isPublic: gymExercise.isPublic,
    title: gymExercise.title,
    userId: context.session!.userId
  };
}

export default addGymExerciseResolver;
