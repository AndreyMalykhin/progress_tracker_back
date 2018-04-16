import {
  validateIconId,
  validateTitle,
  validateUserId
} from "commands/trackable-validators";
import Knex from "knex";
import { IGymExercise } from "models/gym-exercise";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import { validateIdAndClientId } from "utils/common-validators";
import ConstraintViolationError, {
  throwIfNotEmpty
} from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import undefinedIfNull from "utils/undefined-if-null";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IEditGymExerciseCmd = (
  input: IEditGymExerciseCmdInput,
  transaction: Knex.Transaction
) => Promise<IGymExercise>;

interface IEditGymExerciseCmdInput {
  id?: ID;
  clientId?: UUID;
  title?: string;
  iconId?: ID;
  userId: ID;
}

function makeEditGymExerciseCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IEditGymExerciseCmd {
  return async (input, transaction) => {
    const gymExercise = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      TrackableType.GymExercise,
      input.userId,
      transaction
    );
    validateInput(input, gymExercise as IGymExercise);
    const dataToUpdate = {
      iconId: undefinedIfNull(input.iconId),
      title: undefinedIfNull(input.title)
    };
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update(dataToUpdate, "*")
      .where("id", gymExercise!.id);
    return rows[0];
  };
}

function validateInput(
  input: IEditGymExerciseCmdInput,
  gymExercise: IGymExercise | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, gymExercise, errors);
  setError(errors, "userId", validateUserId(input.userId));

  if (input.title != null) {
    setError(errors, "title", validateTitle(input.title));
  }

  if (input.iconId != null) {
    setError(errors, "iconId", validateIconId(input.iconId));
  }

  throwIfNotEmpty(errors);
}

export { makeEditGymExerciseCmd, IEditGymExerciseCmd };
