import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import {
  validateDifficulty,
  validateIconId,
  validateProgressDisplayModeId,
  validateTitle
} from "commands/trackable-validators";
import Knex from "knex";
import { ActivityType } from "models/activity";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITask } from "models/task";
import { ITaskGoal } from "models/task-goal";
import { TrackableType } from "models/trackable";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import { TrackableStatus } from "models/trackable-status";
import IconFetcher from "services/icon-fetcher";
import {
  validateClientId,
  validateEnum,
  validateId,
  validateLength,
  validateList
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IAddTaskGoalCmd = IAddTrackableCmd<ITaskGoal, IAddTaskGoalCmdInput>;

interface IAddTaskGoalCmdInput extends IAddTrackableCmdInput {
  deadlineDate?: number;
  difficulty: Difficulty;
  iconId: ID;
  isPublic: boolean;
  progressDisplayModeId: ProgressDisplayMode;
  tasks: Array<{
    clientId?: UUID;
    title: string;
  }>;
}

function makeAddTaskGoalCmd(db: Knex): IAddTaskGoalCmd {
  return makeAddTrackableCmd(db, validateInput, inputToTrackable, addTasks);
}

async function inputToTrackable(
  input: IAddTaskGoalCmdInput
): Promise<Partial<ITaskGoal>> {
  const {
    clientId,
    deadlineDate,
    difficulty,
    userId,
    progressDisplayModeId,
    iconId,
    isPublic,
    title
  } = input;
  return {
    clientId,
    deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
    difficulty,
    iconId,
    isPublic,
    maxProgress: input.tasks.length,
    order: Date.now(),
    progress: 0,
    progressDisplayModeId,
    statusId: TrackableStatus.Active,
    title,
    typeId: TrackableType.TaskGoal,
    userId
  };
}

async function addTasks(
  input: IAddTaskGoalCmdInput,
  trackable: ITaskGoal,
  transaction: Knex.Transaction,
  db: Knex
) {
  const tasks: ITask[] = input.tasks.map(task => {
    return {
      clientId: task.clientId,
      goalId: trackable.id,
      isDone: false,
      title: task.title,
      userId: input.userId
    } as ITask;
  });
  await db(DbTable.Tasks)
    .transacting(transaction)
    .insert(tasks);
}

async function validateInput(
  input: IAddTaskGoalCmdInput,
  errors: IValidationErrors
) {
  const { difficulty, progressDisplayModeId, iconId, tasks } = input;
  setError(errors, "difficulty", validateDifficulty(difficulty));
  setError(
    errors,
    "progressDisplayModeId",
    validateProgressDisplayModeId(progressDisplayModeId)
  );
  setError(errors, "iconId", validateIconId(iconId));
  const tasksError = validateList(tasks, {
    validateItem: task => {
      const taskErrors: IValidationErrors = {};
      setError(
        taskErrors,
        "clientId",
        validateClientId(task.clientId, { isOptional: true })
      );
      setError(taskErrors, "title", validateTitle(task.title));
      return taskErrors;
    }
  });
  setError(errors, "tasks", tasksError);
}

export { makeAddTaskGoalCmd, IAddTaskGoalCmd, IAddTaskGoalCmdInput };
