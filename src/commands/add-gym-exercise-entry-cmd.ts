import Knex from "knex";
import { IGymExerciseEntry } from "models/gym-exercise-entry";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateClientId,
  validateRange,
  validateReference
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IAddGymExerciseEntryCmd = (
  input: IAddGymExerciseEntryCmdInput,
  transaction: Knex.Transaction
) => Promise<IGymExerciseEntry>;

interface IAddGymExerciseEntryCmdInput {
  clientId?: ID;
  gymExerciseId: ID;
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
    await validateInput(input, trackableFetcher, transaction);
    const entry: Partial<IGymExerciseEntry> = {
      clientId: input.clientId,
      gymExerciseId: input.gymExerciseId,
      repetitionCount: input.repetitionCount,
      setCount: input.setCount,
      weight: input.weight
    };
    const rows = await db(DbTable.GymExerciseEntries)
      .transacting(transaction)
      .insert(entry, "*");
    return rows[0];
  };
}

async function validateInput(
  input: IAddGymExerciseEntryCmdInput,
  trackableFetcher: TrackableFetcher,
  transaction: Knex.Transaction
) {
  const errors: IValidationErrors = {};
  const gymExercise = await trackableFetcher.get(
    input.gymExerciseId,
    TrackableType.GymExercise,
    input.userId,
    transaction
  );
  setError(
    errors,
    "gymExerciseId",
    validateReference(gymExercise && gymExercise.id)
  );
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

  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

export { makeAddGymExerciseEntryCmd, IAddGymExerciseEntryCmd };
