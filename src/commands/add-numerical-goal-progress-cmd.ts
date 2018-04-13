import { IAddGoalProgressCmd } from "commands/add-goal-progress-cmd";
import { IUpdateAggregateProgressCmd } from "commands/update-aggregate-progress-cmd";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IAggregatable } from "models/aggregatable";
import { IGoalAchievedActivity } from "models/goal-achieved-activity";
import { INumericalGoal } from "models/numerical-goal";
import { INumericalGoalProgressChangedActivity } from "models/numerical-goal-progress-changed-activity";
import { TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateProgressDelta,
  validateStatusIdIsActive,
  validateUserId
} from "services/trackable-validators";
import { validateIdAndClientId, validateRange } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

type IAddNumericalGoalProgressCmd = (
  input: IAddNumericalGoalProgressCmdInput,
  transaction: Knex.Transaction
) => Promise<INumericalGoal>;

interface IAddNumericalGoalProgressCmdInput {
  id?: ID;
  clientId?: UUID;
  userId: ID;
  progressDelta: number;
}

function makeAddNumericalGoalProgressCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher,
  addGoalProgressCmd: IAddGoalProgressCmd
): IAddNumericalGoalProgressCmd {
  return async (input, transaction) => {
    const goal = (await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      TrackableType.NumericalGoal,
      input.userId,
      transaction
    )) as INumericalGoal | undefined;
    validateInput(input, goal);

    if (input.progressDelta === 0) {
      return goal!;
    }

    await addActivity(
      goal!.id,
      input.progressDelta,
      input.userId,
      db,
      transaction
    );
    return (await addGoalProgressCmd(
      { goal: goal!, progressDelta: input.progressDelta },
      transaction
    )) as INumericalGoal;
  };
}

function validateInput(
  input: IAddNumericalGoalProgressCmdInput,
  goal: INumericalGoal | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, goal, errors);

  if (goal) {
    setError(
      errors,
      input.id ? "id" : "clientId",
      validateStatusIdIsActive(goal.statusId)
    );
  }

  const { userId, progressDelta } = input;
  setError(errors, "userId", validateUserId(userId));
  const progress = goal ? goal.progress : 0;
  setError(
    errors,
    "progressDelta",
    validateProgressDelta(progressDelta, progress)
  );
  throwIfNotEmpty(errors);
}

async function addActivity(
  trackableId: ID,
  progressDelta: number,
  userId: ID,
  db: Knex,
  transaction: Knex.Transaction
) {
  const activity = {
    progressDelta,
    trackableId,
    typeId: ActivityType.NumericalGoalProgressChanged,
    userId
  } as INumericalGoalProgressChangedActivity;
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert(activity);
}

export { makeAddNumericalGoalProgressCmd, IAddNumericalGoalProgressCmd };
