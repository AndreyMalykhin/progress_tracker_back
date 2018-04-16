import { IAddTaskGoalCmdInput } from "commands/add-task-goal-cmd";
import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import {
  validateDifficulty,
  validateIconId,
  validateProgressDisplayModeId
} from "commands/trackable-validators";
import Knex from "knex";
import { ActivityType } from "models/activity";
import Difficulty from "models/difficulty";
import { INumericalGoal } from "models/numerical-goal";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITaskGoal } from "models/task-goal";
import { TrackableType } from "models/trackable";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import { TrackableStatus } from "models/trackable-status";
import {
  validateClientId,
  validateEnum,
  validateId,
  validateLength,
  validateRange
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IAddNumericalGoalCmd = IAddTrackableCmd<
  INumericalGoal,
  IAddNumericalGoalCmdInput
>;

interface IAddNumericalGoalCmdInput extends IAddTrackableCmdInput {
  deadlineDate?: number;
  difficulty: Difficulty;
  iconId: ID;
  isPublic: boolean;
  progressDisplayModeId: ProgressDisplayMode;
  maxProgress: number;
}

function makeAddNumericalGoalCmd(db: Knex) {
  return makeAddTrackableCmd(db, validateInput, inputToTrackable);
}

async function inputToTrackable(
  input: IAddNumericalGoalCmdInput
): Promise<Partial<INumericalGoal>> {
  const {
    clientId,
    deadlineDate,
    difficulty,
    userId,
    progressDisplayModeId,
    iconId,
    isPublic,
    title,
    maxProgress
  } = input;
  return {
    clientId,
    deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
    difficulty,
    iconId,
    isPublic,
    maxProgress,
    order: Date.now(),
    progress: 0,
    progressDisplayModeId,
    statusId: TrackableStatus.Active,
    title,
    typeId: TrackableType.NumericalGoal,
    userId
  };
}

async function validateInput(
  input: IAddNumericalGoalCmdInput,
  errors: IValidationErrors
) {
  const { difficulty, progressDisplayModeId, iconId, maxProgress } = input;
  setError(errors, "difficulty", validateDifficulty(difficulty));
  setError(
    errors,
    "progressDisplayModeId",
    validateProgressDisplayModeId(progressDisplayModeId)
  );
  setError(errors, "iconId", validateIconId(iconId));
  setError(
    errors,
    "maxProgress",
    validateRange(maxProgress, { min: 1, max: Number.MAX_SAFE_INTEGER })
  );
}

export {
  makeAddNumericalGoalCmd,
  IAddNumericalGoalCmd,
  IAddNumericalGoalCmdInput
};
