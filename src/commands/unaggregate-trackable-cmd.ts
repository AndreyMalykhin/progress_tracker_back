import aggregateProgress from "commands/aggregate-progress";
import updateAggregate from "commands/update-aggregate";
import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { IAggregate } from "models/aggregate";
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

type IUnaggregateTrackableCmd = (
  input: IUnaggregateTrackableCmdInput,
  transaction: Knex.Transaction
) => Promise<{
  removedAggregateId?: ID;
  aggregate?: IAggregate;
  trackable: ITrackable;
}>;

interface IUnaggregateTrackableCmdInput {
  id?: ID;
  clientId?: ID;
  userId: ID;
}

function makeUnaggregateTrackableCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IUnaggregateTrackableCmd {
  return async (input, transaction) => {
    const trackableType = undefined;
    let trackable = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      trackableType,
      input.userId,
      transaction
    );
    validateInput(input, trackable);
    const aggregateId = (trackable as IAggregatable).parentId!;
    trackable = await updateTrackable(trackable!.id, db, transaction);
    const aggregate = await updateAggregate(
      aggregateId,
      transaction,
      db,
      trackableFetcher
    );
    const removedAggregateId = aggregate ? undefined : aggregateId;
    return { aggregate, trackable, removedAggregateId };
  };
}

function validateInput(
  input: IUnaggregateTrackableCmdInput,
  trackable: (ITrackable & IAggregatable) | undefined
) {
  const errors: IValidationErrors = {};
  let idError = validateId(trackable && trackable.id);

  if (trackable && !trackable.parentId) {
    idError = "Should be aggregated";
  }

  setError(errors, input.id != null ? "id" : "clientId", idError);
  throwIfNotEmpty(errors);
}

async function updateTrackable(
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

export { makeUnaggregateTrackableCmd, IUnaggregateTrackableCmd };
