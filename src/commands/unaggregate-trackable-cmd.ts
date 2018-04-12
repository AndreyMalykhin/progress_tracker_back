import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { IAggregate } from "models/aggregate";
import { ITrackable, TrackableType } from "models/trackable";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import { validateId } from "utils/common-validators";
import ConstraintViolationError, {
  throwIfNotEmpty
} from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IUnaggregateTrackableCmd = (
  trackable: { id?: ID; clientId?: UUID },
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
  const trackableType = undefined;
  return async (inputTrackable, userId, transaction) => {
    let trackable = await trackableFetcher.getByIdOrClientId(
      inputTrackable.id,
      inputTrackable.clientId,
      trackableType,
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
  let trackableError = validateId(trackable && trackable.id);

  if (trackable && !trackable.parentId) {
    trackableError = "Should be aggregated";
  }

  setError(errors, "trackable", trackableError);
  throwIfNotEmpty(errors);
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
