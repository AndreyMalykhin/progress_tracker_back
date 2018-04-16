import addGoalProgress from "commands/add-goal-progress";
import {
  validateStatusIdIsActive,
  validateUserId
} from "commands/trackable-validators";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IGoalAchievedActivity } from "models/goal-achieved-activity";
import { ITask } from "models/task";
import { ITaskGoal } from "models/task-goal";
import { ITaskGoalProgressChangedActivity } from "models/task-goal-progress-changed-activity";
import { TrackableStatus } from "models/trackable-status";
import TaskFetcher from "services/task-fetcher";
import TrackableFetcher from "services/trackable-fetcher";
import { validateIdAndClientId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

type ISetTaskDoneCmd = (
  input: ISetTaskDoneCmdInput,
  transaction: Knex.Transaction
) => Promise<ITask>;

interface ISetTaskDoneCmdInput {
  id?: ID;
  clientId?: UUID;
  userId: ID;
  isDone: boolean;
}

function makeSetTaskDoneCmd(
  db: Knex,
  taskFetcher: TaskFetcher,
  trackableFetcher: TrackableFetcher
): ISetTaskDoneCmd {
  return async (input, transaction) => {
    let task = await taskFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      input.userId,
      transaction
    );
    const goal =
      task && ((await trackableFetcher.get(task.goalId)) as ITaskGoal);
    validateInput(input, task, goal);

    if (task!.isDone === input.isDone) {
      return task!;
    }

    task = await updateTask(task!.id, input.isDone, db, transaction);

    if (input.isDone) {
      await addActivity(task!, db, transaction);
    }

    const progressDelta = input.isDone ? 1 : -1;
    await addGoalProgress(
      goal!,
      progressDelta,
      transaction,
      db,
      trackableFetcher
    );
    return task;
  };
}

function validateInput(
  input: ISetTaskDoneCmdInput,
  task: ITask | undefined,
  goal: ITaskGoal | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, task, errors);

  if (goal) {
    setError(
      errors,
      input.id ? "id" : "clientId",
      validateStatusIdIsActive(goal.statusId)
    );
  }

  setError(errors, "userId", validateUserId(input.userId));
  throwIfNotEmpty(errors);
}

async function updateTask(
  id: ID,
  isDone: boolean,
  db: Knex,
  transaction: Knex.Transaction
): Promise<ITask> {
  const rows = await db(DbTable.Tasks)
    .transacting(transaction)
    .update({ isDone }, "*")
    .where("id", id);
  return rows[0];
}

async function addActivity(
  task: ITask,
  db: Knex,
  transaction: Knex.Transaction
) {
  const activity = {
    taskId: task.id,
    trackableId: task.goalId,
    typeId: ActivityType.TaskGoalProgressChanged,
    userId: task.userId
  } as ITaskGoalProgressChangedActivity;
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert(activity);
}

export { makeSetTaskDoneCmd, ISetTaskDoneCmd };
