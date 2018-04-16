import {
  validateIconId,
  validateTitle,
  validateUserId
} from "commands/trackable-validators";
import Knex from "knex";
import { ICounter } from "models/counter";
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

type IEditCounterCmd = (
  input: IEditCounterCmdInput,
  transaction: Knex.Transaction
) => Promise<ICounter>;

interface IEditCounterCmdInput {
  id?: ID;
  clientId?: UUID;
  title?: string;
  iconId?: ID;
  userId: ID;
}

function makeEditCounterCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IEditCounterCmd {
  return async (input, transaction) => {
    const counter = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      TrackableType.Counter,
      input.userId,
      transaction
    );
    validateInput(input, counter as ICounter);
    const dataToUpdate = {
      iconId: undefinedIfNull(input.iconId),
      title: undefinedIfNull(input.title)
    };
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update(dataToUpdate, "*")
      .where("id", counter!.id);
    return rows[0];
  };
}

function validateInput(
  input: IEditCounterCmdInput,
  counter: ICounter | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, counter, errors);
  setError(errors, "userId", validateUserId(input.userId));

  if (input.title != null) {
    setError(errors, "title", validateTitle(input.title));
  }

  if (input.iconId != null) {
    setError(errors, "iconId", validateIconId(input.iconId));
  }

  throwIfNotEmpty(errors);
}

export { makeEditCounterCmd, IEditCounterCmd };
