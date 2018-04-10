import Knex from "knex";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import { ITrackable } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import { validateReference } from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IBreakAggregateCmd = (
  aggregate: { id?: ID; clientId?: ID },
  userId: ID,
  transaction: Knex.Transaction
) => Promise<ITrackable[]>;

function makeBreakAggregateCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IBreakAggregateCmd {
  return async (inputAggregate, userId, transaction) => {
    const aggregate = await trackableFetcher.getByIdOrClientId(
      inputAggregate.id,
      inputAggregate.clientId,
      userId
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
  setError(errors, "aggregate", validateReference(aggregate && aggregate.id));

  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

async function updateChildren(
  aggregateId: ID,
  db: Knex,
  transaction: Knex.Transaction,
  trackableFetcher: TrackableFetcher
) {
  const result: ITrackable[] = [];
  let order = Date.now();
  const children = await trackableFetcher.getByParentId(aggregateId);

  for (const child of children) {
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update({ parentId: null, order }, "*")
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