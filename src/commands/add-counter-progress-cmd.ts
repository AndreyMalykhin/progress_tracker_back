import aggregateProgress from "commands/aggregate-progress";
import {
  validateProgressDelta,
  validateUserId
} from "commands/trackable-validators";
import updateAggregate from "commands/update-aggregate";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IAggregatable } from "models/aggregatable";
import { ICounter } from "models/counter";
import { ICounterProgressChangedActivity } from "models/counter-progress-changed-activity";
import { ITrackable, TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateIdAndClientId,
  validateNonZero,
  validateRange
} from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

type IAddCounterProgressCmd = (
  input: IAddCounterProgressCmdInput,
  transaction: Knex.Transaction
) => Promise<ICounter>;

interface IAddCounterProgressCmdInput {
  id?: ID;
  clientId?: UUID;
  userId: ID;
  progressDelta: number;
}

function makeAddCounterProgressCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IAddCounterProgressCmd {
  return async (input, transaction) => {
    let counter = (await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      TrackableType.Counter,
      input.userId,
      transaction
    )) as ICounter | undefined;
    validateInput(input, counter);

    if (input.progressDelta === 0) {
      return counter!;
    }

    counter = await updateCounter(
      counter!,
      input.progressDelta,
      db,
      transaction
    );

    if (counter.parentId) {
      const aggregate = await updateAggregate(
        counter.parentId,
        transaction,
        db,
        trackableFetcher
      );

      if (!aggregate) {
        counter.parentId = null;
      }
    }

    await addActivity(counter, input.progressDelta, db, transaction);
    return counter;
  };
}

function validateInput(
  input: IAddCounterProgressCmdInput,
  counter: ICounter | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, counter, errors);
  const { userId, progressDelta } = input;
  setError(errors, "userId", validateUserId(userId));
  const progress = counter ? counter.progress : 0;
  setError(
    errors,
    "progressDelta",
    validateProgressDelta(progressDelta, progress)
  );
  throwIfNotEmpty(errors);
}

async function updateCounter(
  counter: ICounter,
  progressDelta: number,
  db: Knex,
  transaction: Knex.Transaction
): Promise<ICounter> {
  const dataToUpdate = {
    id: counter.id,
    progress: counter.progress + progressDelta
  } as ICounter;
  const rows = await db(DbTable.Trackables)
    .transacting(transaction)
    .update(dataToUpdate, "*")
    .where("id", counter.id);
  return rows[0];
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
    typeId: ActivityType.CounterProgressChanged,
    userId: trackable.userId
  } as ICounterProgressChangedActivity;
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert(activity);
}

export { makeAddCounterProgressCmd, IAddCounterProgressCmd };
