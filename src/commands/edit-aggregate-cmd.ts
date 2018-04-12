import Knex from "knex";
import { IAggregate } from "models/aggregate";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateIconId,
  validateTitle,
  validateUserId
} from "services/trackable-validators";
import { validateIdAndClientId } from "utils/common-validators";
import ConstraintViolationError, {
  throwIfNotEmpty
} from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import undefinedIfNull from "utils/undefined-if-null";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IEditAggregateCmd = (
  input: IEditAggregateCmdInput,
  transaction: Knex.Transaction
) => Promise<IAggregate>;

interface IEditAggregateCmdInput {
  id?: ID;
  clientId?: UUID;
  title: string;
  userId: ID;
}

function makeEditAggregateCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IEditAggregateCmd {
  return async (input, transaction) => {
    const aggregate = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      TrackableType.Aggregate,
      input.userId,
      transaction
    );
    validateInput(input, aggregate as IAggregate);
    const dataToUpdate = {
      title: input.title
    };
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update(dataToUpdate, "*")
      .where("id", aggregate!.id);
    return rows[0];
  };
}

function validateInput(
  input: IEditAggregateCmdInput,
  aggregate: IAggregate | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, aggregate, errors);
  setError(errors, "userId", validateUserId(input.userId));
  setError(errors, "title", validateTitle(input.title));
  throwIfNotEmpty(errors);
}

export { makeEditAggregateCmd, IEditAggregateCmd };
