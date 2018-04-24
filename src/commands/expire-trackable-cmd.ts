import updateAggregate from "commands/update-aggregate";
import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { ITrackable } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import TrackableFetcher from "services/trackable-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { makeLoaderMapFactory } from "utils/loader-map";
import { makeLog } from "utils/log";

type IExpireTrackableCmd = (
  trackable: ITrackable & IAggregatable,
  transaction: Knex.Transaction
) => Promise<void>;

const log = makeLog("expire-trackable-cmd");

function makeExpireTrackableCmd(db: Knex, trackableFetcher: TrackableFetcher) {
  const expireTrackableCmd: IExpireTrackableCmd = async (
    trackable,
    transaction
  ) => {
    log.trace("expireTrackableCmd");
    await updateTrackable(trackable.id, transaction);

    if (trackable.parentId) {
      await updateAggregate(
        trackable.parentId,
        transaction,
        db,
        trackableFetcher
      );
    }
  };
  return expireTrackableCmd;
}

function updateTrackable(id: ID, transaction: Knex.Transaction) {
  return transaction(DbTable.Trackables)
    .update({
      parentId: null,
      statusChangeDate: new Date(),
      statusId: TrackableStatus.Expired
    } as ITrackable & IAggregatable)
    .where("id", id);
}

export { makeExpireTrackableCmd, IExpireTrackableCmd };
