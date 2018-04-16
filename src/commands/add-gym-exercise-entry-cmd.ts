import Knex from "knex";
import { ActivityType } from "models/activity";
import { IGymExercise } from "models/gym-exercise";
import { IGymExerciseEntry } from "models/gym-exercise-entry";
import { IGymExerciseEntryAddedActivity } from "models/gym-exercise-entry-added-activity";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateClientId,
  validateId,
  validateRange
} from "utils/common-validators";
import ConstraintViolationError, {
  throwIfNotEmpty
} from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IAddGymExerciseEntryCmd = (
  input: IAddGymExerciseEntryCmdInput,
  transaction: Knex.Transaction
) => Promise<IGymExerciseEntry>;

interface IAddGymExerciseEntryCmdInput {
  clientId?: UUID;
  gymExercise: { id?: ID; clientId?: UUID };
  userId: ID;
  repetitionCount: number;
  setCount: number;
  weight: number;
}

function makeAddGymExerciseEntryCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IAddGymExerciseEntryCmd {
  return async (input, transaction) => {
    const gymExercise = (await trackableFetcher.getByIdOrClientId(
      input.gymExercise.id,
      input.gymExercise.clientId,
      TrackableType.GymExercise,
      input.userId,
      transaction
    )) as IGymExercise | undefined;
    await validateInput(input, gymExercise);
    let entry = {
      clientId: input.clientId,
      gymExerciseId: gymExercise!.id,
      repetitionCount: input.repetitionCount,
      setCount: input.setCount,
      userId: input.userId,
      weight: input.weight
    } as IGymExerciseEntry;
    const rows = await db(DbTable.GymExerciseEntries)
      .transacting(transaction)
      .insert(entry, "*");
    entry = rows[0];
    await addActivity(entry, db, transaction);
    return entry;
  };
}

async function validateInput(
  input: IAddGymExerciseEntryCmdInput,
  gymExercise: IGymExercise | undefined
) {
  const errors: IValidationErrors = {};
  setError(errors, "userId", validateId(input.userId));
  setError(errors, "gymExercise", validateId(gymExercise && gymExercise.id));
  setError(
    errors,
    "clientId",
    validateClientId(input.clientId, { isOptional: true })
  );
  setError(
    errors,
    "repetitionCount",
    validateRange(input.repetitionCount, {
      isInteger: true,
      max: 1024,
      min: 1
    })
  );
  setError(
    errors,
    "setCount",
    validateRange(input.setCount, {
      isInteger: true,
      max: 1024,
      min: 1
    })
  );
  setError(
    errors,
    "weight",
    validateRange(input.weight, {
      max: 2048,
      min: 0
    })
  );
  throwIfNotEmpty(errors);
}

async function addActivity(
  entry: IGymExerciseEntry,
  db: Knex,
  transaction: Knex.Transaction
) {
  const activity = {
    gymExerciseEntryId: entry.id,
    trackableId: entry.gymExerciseId,
    typeId: ActivityType.GymExerciseEntryAdded,
    userId: entry.userId
  } as IGymExerciseEntryAddedActivity;
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert(activity);
}

export { makeAddGymExerciseEntryCmd, IAddGymExerciseEntryCmd };
