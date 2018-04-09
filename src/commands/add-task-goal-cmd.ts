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
import ProgressDisplayMode from "models/progress-display-mode";
import { ITaskGoal } from "models/task-goal";
import { TrackableType } from "models/trackable";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import { TrackableStatus } from "models/trackable-status";
import IconFetcher from "services/icon-fetcher";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";
import {
  validateEnum,
  validateLength,
  validateList,
  validateReference,
  validateUUID
} from "utils/validators";

type IAddTaskGoalCmd = IAddTrackableCmd<ITaskGoal, IAddTaskGoalCmdInput>;

interface IAddTaskGoalCmdInput extends IAddTrackableCmdInput {
  deadlineDate?: number;
  difficulty: Difficulty;
  iconId: ID;
  isPublic: boolean;
  progressDisplayModeId: ProgressDisplayMode;
  tasks: Array<{
    clientId?: ID;
    title: string;
  }>;
}

function makeAddTaskGoalCmd(db: Knex): IAddTaskGoalCmd {
  return makeAddTrackableCmd(db, validateInput, inputToTrackable, addTasks);
}

function inputToTrackable(input: IAddTaskGoalCmdInput): Partial<ITaskGoal> {
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
  const tasks = input.tasks.map(task => {
    return {
      clientId: task.clientId,
      goalId: trackable.id,
      isDone: false,
      title: task.title
    };
  });
  await db(DbTable.Tasks)
    .transacting(transaction)
    .insert(tasks);
}

function validateInput(input: IAddTaskGoalCmdInput, errors: IValidationErrors) {
  const { difficulty, progressDisplayModeId, iconId, tasks } = input;
  validateDifficulty(difficulty, errors);
  validateProgressDisplayMode(progressDisplayModeId, errors);
  validateIcon(iconId, errors);
  const tasksError = validateList(tasks, {
    validateItem: task => {
      const taskErrors: IValidationErrors = {};
      setError(
        taskErrors,
        "clientId",
        validateUUID(task.clientId, { isOptional: true })
      );
      setError(taskErrors, "title", validateLength(task.title, { max: 255 }));
      return taskErrors;
    }
  });
  setError(errors, "tasks", tasksError);
}

export { makeAddTaskGoalCmd, IAddTaskGoalCmd, IAddTaskGoalCmdInput };
