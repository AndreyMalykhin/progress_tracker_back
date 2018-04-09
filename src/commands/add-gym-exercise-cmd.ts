import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import { validateIcon } from "commands/trackable-cmd-helpers";
import Knex from "knex";
import { IGymExercise } from "models/gym-exercise";
import { TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import ID from "utils/id";
import { IValidationErrors } from "utils/validation-result";

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

function inputToTrackable(
  input: IAddGymExerciseCmdInput
): Partial<IGymExercise> {
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

function validateInput(
  input: IAddGymExerciseCmdInput,
  errors: IValidationErrors
) {
  validateIcon(input.iconId, errors);
}

export { makeAddGymExerciseCmd, IAddGymExerciseCmdInput, IAddGymExerciseCmd };
