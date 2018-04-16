import aggregateProgress from "commands/aggregate-progress";
import { validateChildren } from "commands/trackable-validators";
import updateAggregate from "commands/update-aggregate";
import Knex from "knex";
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

    let aggregate = (await trackableFetcher.getByIdOrClientId(
      inputAggregate.id,
      inputAggregate.clientId,
      TrackableType.Aggregate,
      userId,
      transaction
    )) as IAggregate | undefined;
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
    aggregate = await updateAggregate(
      aggregate!.id,
      transaction,
      db,
      trackableFetcher,
      newChildren
    );
    return aggregate!;
  };
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
  throwIfNotEmpty(errors);
}

export { makeAddToAggregateCmd, IAddToAggregateCmd };
