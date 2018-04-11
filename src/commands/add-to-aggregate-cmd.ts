import Knex from "knex";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import { ITrackable, TrackableType } from "models/trackable";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import { validateChildren } from "services/trackable-validators";
import { validateId } from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IAddToAggregateCmd = (
  children: Array<{ id?: ID; clientId?: UUID }>,
  aggregate: { id?: ID; clientId?: UUID },
  userId: ID,
  transaction: Knex.Transaction
) => Promise<IAggregate>;

function makeAddToAggregateCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IAddToAggregateCmd {
  return async (inputChildren, inputAggregate, userId, transaction) => {
    const inputChildIds = [];
    const inputChildClientIds = [];

    for (const child of inputChildren) {
      if (child.id) {
        inputChildIds.push(child.id);
      } else if (child.clientId) {
        inputChildClientIds.push(child.clientId);
      }
    }

    const aggregate = await trackableFetcher.getByIdOrClientId(
      inputAggregate.id,
      inputAggregate.clientId,
      TrackableType.Aggregate,
      userId,
      transaction
    );
    const oldChildren: IAggregateChildren = aggregate
      ? await trackableFetcher.getByParentId(aggregate.id)
      : [];
    const trackableType = undefined;
    const childrenToAdd = await trackableFetcher.getByIdsOrClientIds(
      inputChildIds,
      inputChildClientIds,
      trackableType,
      userId,
      transaction
    );
    validateInput(childrenToAdd, oldChildren, aggregate);
    await updateChildren(childrenToAdd, aggregate!.id, transaction, db);
    const newChildren = oldChildren.concat(childrenToAdd as IAggregateChildren);
    return await updateAggregate(
      aggregate!.id,
      newChildren as IAggregateChildren,
      transaction,
      db
    );
  };
}

async function updateAggregate(
  aggregateId: ID,
  children: IAggregateChildren,
  transaction: Knex.Transaction,
  db: Knex
) {
  const progress = aggregateProgress(children).current;
  const rows = await db(DbTable.Trackables)
    .transacting(transaction)
    .update("progress", progress, "*")
    .where("id", aggregateId);
  return rows[0];
}

async function updateChildren(
  children: ITrackable[],
  aggregateId: ID,
  transaction: Knex.Transaction,
  db: Knex
) {
  let order = Date.now();

  for (const child of children) {
    await db(DbTable.Trackables)
      .transacting(transaction)
      .update({ parentId: aggregateId, order })
      .where("id", child.id);
    --order;
  }
}

function validateInput(
  childrenToAdd: ITrackable[],
  oldChildren: IAggregateChildren,
  aggregate?: ITrackable
) {
  const errors: IValidationErrors = {};
  setError(errors, "aggregate", validateId(aggregate && aggregate.id));
  setError(errors, "children", validateChildren(childrenToAdd, oldChildren));

  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

export { makeAddToAggregateCmd, IAddToAggregateCmd };
