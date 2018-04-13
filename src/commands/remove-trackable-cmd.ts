import { IUpdateAggregateCmd } from "commands/update-aggregate-cmd";
import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { IAggregate } from "models/aggregate";
import { ITrackable, TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import { validateIdAndClientId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors } from "utils/validation-result";

type IRemoveTrackableCmd = (
  input: IRemoveTrackableCmdInput,
  transaction: Knex.Transaction
) => Promise<{
  removedAggregateId?: ID;
  aggregate?: IAggregate;
}>;

interface IRemoveTrackableCmdInput {
  id?: ID;
  clientId?: UUID;
  userId: ID;
}

function makeRemoveTrackableCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher,
  updateAggregateCmd: IUpdateAggregateCmd
): IRemoveTrackableCmd {
  return async (input, transaction) => {
    const trackableType = undefined;
    let trackable = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      trackableType,
      input.userId,
      transaction
    );

    if (trackable && trackable.typeId === TrackableType.Aggregate) {
      trackable = undefined;
    }

    validateInput(input, trackable);
    await remove(trackable!.id, db, transaction);
    const aggregateId = (trackable as IAggregatable).parentId;
    let aggregate: IAggregate | undefined;
    let removedAggregateId: ID | undefined;

    if (aggregateId) {
      aggregate = await updateAggregateCmd({ id: aggregateId }, transaction);
      removedAggregateId = aggregate ? undefined : aggregateId;
    }

    return { aggregate, removedAggregateId };
  };
}

function validateInput(
  input: IRemoveTrackableCmdInput,
  trackable: ITrackable | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, trackable, errors);
  throwIfNotEmpty(errors);
}

async function remove(id: ID, db: Knex, transaction: Knex.Transaction) {
  await db(DbTable.Trackables)
    .transacting(transaction)
    .delete()
    .where("id", id);
}

export { makeRemoveTrackableCmd, IRemoveTrackableCmd };
