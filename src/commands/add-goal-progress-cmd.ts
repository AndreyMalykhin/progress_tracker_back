import { IUpdateAggregateCmd } from "commands/update-aggregate-cmd";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IAggregatable } from "models/aggregatable";
import { IGoal } from "models/goal";
import { IGoalAchievedActivity } from "models/goal-achieved-activity";
import { ITrackable } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import DbTable from "utils/db-table";
import ID from "utils/id";

type IAddGoalProgressCmd<TGoal = ITrackable & IGoal & IAggregatable> = (
  input: IAddGoalProgressCmdInput<TGoal>,
  transaction: Knex.Transaction
) => Promise<TGoal>;

interface IAddGoalProgressCmdInput<TGoal> {
  goal: TGoal;
  progressDelta: number;
}

function makeAddGoalProgressCmd(
  db: Knex,
  updateAggregateCmd: IUpdateAggregateCmd
): IAddGoalProgressCmd {
  return async (input, transaction) => {
    if (input.progressDelta === 0) {
      return input.goal;
    }

    const goal = await updateGoal(
      input.goal,
      input.progressDelta,
      db,
      transaction
    );

    if (goal.parentId) {
      await updateAggregateCmd({ id: goal.parentId }, transaction);
    }

    return goal;
  };
}

async function updateGoal<TGoal extends ITrackable & IGoal>(
  goal: TGoal,
  progressDelta: number,
  db: Knex,
  transaction: Knex.Transaction
): Promise<TGoal> {
  let progress = goal.progress + progressDelta;
  let statusId;
  let statusChangeDate;

  if (progress >= goal.maxProgress) {
    progress = goal.maxProgress;
    statusId = TrackableStatus.PendingProof;
    statusChangeDate = new Date();
    await addGoalAchievedActivity(goal.id, goal.userId, db, transaction);
  }

  const dataToUpdate = {
    achievementDate: statusChangeDate,
    progress,
    statusChangeDate,
    statusId
  } as TGoal;
  const rows = await db(DbTable.Trackables)
    .transacting(transaction)
    .update(dataToUpdate, "*")
    .where("id", goal.id);
  return rows[0];
}

async function addGoalAchievedActivity(
  trackableId: ID,
  userId: ID,
  db: Knex,
  transaction: Knex.Transaction
) {
  const activity = {
    trackableId,
    typeId: ActivityType.GoalAchieved,
    userId
  } as IGoalAchievedActivity;
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert(activity);
}

export { makeAddGoalProgressCmd, IAddGoalProgressCmd };
