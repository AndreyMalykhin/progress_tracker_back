import addGoalProgress from "commands/add-goal-progress";
import aggregateProgress from "commands/aggregate-progress";
import {
  validateProgressDelta,
  validateStatusIdIsActive,
  validateUserId
} from "commands/trackable-validators";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IAggregatable } from "models/aggregatable";
import { INumericalGoal } from "models/numerical-goal";
import { INumericalGoalProgressChangedActivity } from "models/numerical-goal-progress-changed-activity";
import { ITrackable, TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import TrackableFetcher from "services/trackable-fetcher";
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
  trackableFetcher: TrackableFetcher
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

    await addActivity(goal!, input.progressDelta, db, transaction);
    return (await addGoalProgress(
      goal!,
      input.progressDelta,
      transaction,
      db,
      trackableFetcher
    )) as INumericalGoal;
  };
}

function validateInput(
  input: IAddNumericalGoalProgressCmdInput,
  goal: INumericalGoal | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, goal, errors);
  const idField = input.id != null ? "id" : "clientId";

  if (!errors[idField]) {
    setError(errors, idField, validateStatusIdIsActive(goal && goal.statusId));
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
  trackable: ITrackable,
  progressDelta: number,
  db: Knex,
  transaction: Knex.Transaction
) {
  const activity = {
    isPublic: trackable.isPublic,
    progressDelta,
    trackableId: trackable.id,
    typeId: ActivityType.NumericalGoalProgressChanged,
    userId: trackable.userId
  } as INumericalGoalProgressChangedActivity;
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert(activity);
}

export { makeAddNumericalGoalProgressCmd, IAddNumericalGoalProgressCmd };
