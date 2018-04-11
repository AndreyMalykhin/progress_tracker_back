import Knex from "knex";
import { IGymExercise } from "models/gym-exercise";
import { IGymExerciseEntry } from "models/gym-exercise-entry";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateClientId,
  validateId,
  validateRange
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
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
    const gymExercise = await trackableFetcher.getByIdOrClientId(
      input.gymExercise.id,
      input.gymExercise.clientId,
      TrackableType.GymExercise,
      input.userId,
      transaction
    );
    await validateInput(input, gymExercise as IGymExercise);
    const entry: Partial<IGymExerciseEntry> = {
      clientId: input.clientId,
      gymExerciseId: gymExercise!.id,
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
  gymExercise?: IGymExercise
) {
  const errors: IValidationErrors = {};
  setError(errors, "gymExerciseId", validateId(gymExercise && gymExercise.id));
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
