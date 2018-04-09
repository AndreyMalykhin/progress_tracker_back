import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import Knex from "knex";
import { ActivityType } from "models/activity";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITaskGoal } from "models/task-goal";
import { TrackableType } from "models/trackable";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import { TrackableStatus } from "models/trackable-status";
import IconFetcher from "services/icon-fetcher";
import {
  validateEnum,
  validateLength,
  validateList,
  validateReference,
  validateUUID
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

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

async function validateInput(
  input: IAddTaskGoalCmdInput,
  errors: IValidationErrors
) {
  const { difficulty, progressDisplayModeId, iconId, tasks } = input;
  setError(
    errors,
    "difficulty",
    validateEnum(difficulty, {
      values: [
        Difficulty.Easy,
        Difficulty.Medium,
        Difficulty.Hard,
        Difficulty.Impossible
      ]
    })
  );
  setError(
    errors,
    "progressDisplayModeId",
    validateReference(progressDisplayModeId)
  );
  setError(errors, "iconId", validateReference(iconId));
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
