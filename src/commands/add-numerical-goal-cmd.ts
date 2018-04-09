import { IAddTaskGoalCmdInput } from "commands/add-task-goal-cmd";
import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import {
  validateDifficulty,
  validateIcon,
  validateProgressDisplayMode
} from "commands/trackable-cmd-helpers";
import Knex from "knex";
import { ActivityType } from "models/activity";
import Difficulty from "models/difficulty";
import { INumericalGoal } from "models/numerical-goal";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITaskGoal } from "models/task-goal";
import { TrackableType } from "models/trackable";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import { TrackableStatus } from "models/trackable-status";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";
import {
  validateEnum,
  validateLength,
  validateRange,
  validateReference,
  validateUUID
} from "utils/validators";

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

function inputToTrackable(
  input: IAddNumericalGoalCmdInput
): Partial<INumericalGoal> {
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

function validateInput(
  input: IAddNumericalGoalCmdInput,
  errors: IValidationErrors
) {
  const { difficulty, progressDisplayModeId, iconId, maxProgress } = input;
  validateDifficulty(difficulty, errors);
  validateProgressDisplayMode(progressDisplayModeId, errors);
  validateIcon(iconId, errors);
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
