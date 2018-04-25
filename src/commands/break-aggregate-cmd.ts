import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import { ITrackable, TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import { validateId } from "utils/common-validators";
import ConstraintViolationError, {
  throwIfNotEmpty
} from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IBreakAggregateCmd = (
  input: IBreakAggregateCmdInput,
  transaction: Knex.Transaction
) => Promise<ITrackable[]>;

interface IBreakAggregateCmdInput {
  aggregate: { id?: ID; clientId?: UUID };
  userId: ID;
}

function makeBreakAggregateCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IBreakAggregateCmd {
  return async (input, transaction) => {
    const aggregate = await trackableFetcher.getByIdOrClientId(
      input.aggregate.id,
      input.aggregate.clientId,
      TrackableType.Aggregate,
      input.userId,
      transaction
    );
    validateInput(aggregate);
    const children = await updateChildren(
      aggregate!.id,
      db,
      transaction,
      trackableFetcher
    );
    await removeAggregate(aggregate!.id, db, transaction);
    return children;
  };
}

function validateInput(aggregate?: ITrackable) {
  const errors: IValidationErrors = {};
  setError(errors, "aggregate", validateId(aggregate && aggregate.id));
  throwIfNotEmpty(errors);
}

async function updateChildren(
  aggregateId: ID,
  db: Knex,
  transaction: Knex.Transaction,
  trackableFetcher: TrackableFetcher
) {
  const result: ITrackable[] = [];
  let order = Date.now();
  const children = await trackableFetcher.getByParentId(
    aggregateId,
    transaction
  );

  for (const child of children) {
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update({ parentId: null, order } as IAggregatable & ITrackable, "*")
      .where("id", child.id);
    result.push(rows[0]);
    --order;
  }

  return result;
}

function removeAggregate(id: ID, db: Knex, transaction: Knex.Transaction) {
  return db(DbTable.Trackables)
    .transacting(transaction)
    .delete()
    .where("id", id);
}

export { makeBreakAggregateCmd, IBreakAggregateCmd };
