import aggregateProgress from "commands/aggregate-progress";
import Knex from "knex";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import { TrackableStatus } from "models/trackable-status";
import TrackableFetcher from "services/trackable-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";

async function updateAggregate(
  id: ID,
  transaction: Knex.Transaction,
  db: Knex,
  trackableFetcher: TrackableFetcher,
  children?: IAggregateChildren
) {
  children =
    children || (await trackableFetcher.getByParentId(id, transaction));
  let aggregate: IAggregate | undefined;
  let hasActiveChildren = false;

  if (children.length) {
    for (const child of children) {
      if (
        child.statusId === TrackableStatus.Active ||
        child.statusId === TrackableStatus.PendingProof
      ) {
        hasActiveChildren = true;
        break;
      }
    }

    if (hasActiveChildren) {
      aggregate = await updateProgress(id, children, db, transaction);
    } else {
      await remove(id, db, transaction);
    }
  } else {
    await remove(id, db, transaction);
  }

  return aggregate;
}

async function updateProgress(
  id: ID,
  children: IAggregateChildren,
  db: Knex,
  transaction: Knex.Transaction
) {
  const progress = aggregateProgress(children).current;
  const rows = await db(DbTable.Trackables)
    .transacting(transaction)
    .update("progress", progress, "*")
    .where("id", id);
  return rows[0];
}

async function remove(id: ID, db: Knex, transaction: Knex.Transaction) {
  await db(DbTable.Trackables)
    .transacting(transaction)
    .delete()
    .where("id", id);
}

export default updateAggregate;
