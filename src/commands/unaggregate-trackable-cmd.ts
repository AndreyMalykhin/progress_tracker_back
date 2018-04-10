import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { IAggregate } from "models/aggregate";
import { ITrackable } from "models/trackable";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import { validateReference } from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IUnaggregateTrackableCmd = (
  trackable: { id?: ID; clientId?: ID },
  userId: ID,
  transaction: Knex.Transaction
) => Promise<{
  removedAggregateId?: ID;
  aggregate?: IAggregate;
  trackable: ITrackable;
}>;

function makeUnaggregateTrackableCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IUnaggregateTrackableCmd {
  return async (inputTrackable, userId, transaction) => {
    let trackable = await trackableFetcher.getByIdOrClientId(
      inputTrackable.id,
      inputTrackable.clientId,
      userId,
      transaction
    );
    validateInput(trackable);
    const aggregateId = (trackable as IAggregatable).parentId!;
    trackable = await updateTarget(trackable!.id, db, transaction);
    const { aggregate, removedAggregateId } = await updateAggregate(
      aggregateId,
      db,
      transaction,
      trackableFetcher
    );
    return { aggregate, trackable, removedAggregateId };
  };
}

function validateInput(trackable?: ITrackable & IAggregatable) {
  const errors: IValidationErrors = {};
  let trackableError = validateReference(trackable && trackable.id);

  if (trackable && !trackable.parentId) {
    trackableError = "Should be aggregated";
  }

  setError(errors, "trackable", trackableError);

  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

async function updateTarget(
  id: ID,
  db: Knex,
  transaction: Knex.Transaction
): Promise<ITrackable> {
  const rows = await db(DbTable.Trackables)
    .transacting(transaction)
    .update({ parentId: null, order: Date.now() }, "*")
    .where("id", id);
  return rows[0];
}

async function updateAggregate(
  id: ID,
  db: Knex,
  transaction: Knex.Transaction,
  trackableFetcher: TrackableFetcher
) {
  const children = await trackableFetcher.getByParentId(id, transaction);
  let removedAggregateId;
  let aggregate: IAggregate;

  if (children.length) {
    const progress = aggregateProgress(children).current;
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update("progress", progress, "*")
      .where("id", id);
    aggregate = rows[0];
  } else {
    await db(DbTable.Trackables)
      .transacting(transaction)
      .delete()
      .where("id", id);
    removedAggregateId = id;
  }

  return { aggregate: aggregate!, removedAggregateId };
}

export { makeUnaggregateTrackableCmd, IUnaggregateTrackableCmd };
