import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import Knex from "knex";
import { IGymExercise } from "models/gym-exercise";
import { TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import { validateReference } from "utils/common-validators";
import ID from "utils/id";
import { IValidationErrors, setError } from "utils/validation-result";

type IAddGymExerciseCmd = IAddTrackableCmd<
  IGymExercise,
  IAddGymExerciseCmdInput
>;

interface IAddGymExerciseCmdInput extends IAddTrackableCmdInput {
  iconId: ID;
  isPublic: boolean;
}

function makeAddGymExerciseCmd(db: Knex): IAddGymExerciseCmd {
  return makeAddTrackableCmd(db, validateInput, inputToTrackable);
}

async function inputToTrackable(
  input: IAddGymExerciseCmdInput
): Promise<Partial<IGymExercise>> {
  const { clientId, userId, iconId, isPublic, title } = input;
  return {
    clientId,
    iconId,
    isPublic,
    order: Date.now(),
    statusId: TrackableStatus.Active,
    title,
    typeId: TrackableType.GymExercise,
    userId
  };
}

async function validateInput(
  input: IAddGymExerciseCmdInput,
  errors: IValidationErrors
) {
  setError(errors, "iconId", validateReference(input.iconId));
}

export { makeAddGymExerciseCmd, IAddGymExerciseCmdInput, IAddGymExerciseCmd };
