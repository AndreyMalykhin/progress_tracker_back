import updateAggregate from "commands/update-aggregate";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IAggregatable } from "models/aggregatable";
import { IGoal } from "models/goal";
import { IGoalAchievedActivity } from "models/goal-achieved-activity";
import { ITrackable } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import TrackableFetcher from "services/trackable-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";

async function addGoalProgress(
  goal: ITrackable & IGoal & IAggregatable,
  value: number,
  transaction: Knex.Transaction,
  db: Knex,
  trackableFetcher: TrackableFetcher
) {
  if (value === 0) {
    return goal;
  }

  goal = await updateGoal(goal, value, db, transaction);

  if (goal.parentId) {
    await updateAggregate(goal.parentId, transaction, db, trackableFetcher);
  }

  return goal;
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

export default addGoalProgress;
