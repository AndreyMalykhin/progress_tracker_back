import Knex from "knex";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import { ITrackable } from "models/trackable";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import validateAggregateChildren from "services/validate-aggregate-children";
import { validateReference } from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IAddToAggregateCmd = (
  children: Array<{ id?: ID; clientId?: ID }>,
  aggregate: { id?: ID; clientId?: ID },
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
      inputAggregate.clientId
    );
    const oldChildren = aggregate
      ? await trackableFetcher.getByParentId(aggregate.id)
      : [];
    const childrenToAdd = await trackableFetcher.getByIdsOrClientIds(
      inputChildIds,
      inputChildClientIds,
      userId
    );
    validateInput(childrenToAdd, oldChildren as IAggregateChildren, aggregate);
    await updateChildren(childrenToAdd, aggregate!.id, transaction, db);
    const newChildren = oldChildren.concat(childrenToAdd);
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
  setError(errors, "aggregate", validateReference(aggregate && aggregate.id));

  if (childrenToAdd.length) {
    setError(
      errors,
      "children",
      validateAggregateChildren(childrenToAdd, oldChildren)
    );
  } else {
    setError(errors, "children", "Should not be empty");
  }

  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

export { makeAddToAggregateCmd, IAddToAggregateCmd };
