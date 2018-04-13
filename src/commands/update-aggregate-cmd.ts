import Knex from "knex";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";

type IUpdateAggregateCmd = (
  input: { id: ID; children?: IAggregateChildren },
  transaction: Knex.Transaction
) => Promise<IAggregate | undefined>;

function makeUpdateAggregateCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IUpdateAggregateCmd {
  return async (input, transaction) => {
    const { id } = input;
    const children =
      input.children || (await trackableFetcher.getByParentId(id, transaction));
    let aggregate: IAggregate | undefined;

    if (children.length) {
      aggregate = await updateProgress(id, children, db, transaction);
    } else {
      await remove(id, db, transaction);
    }

    return aggregate;
  };
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

export { makeUpdateAggregateCmd, IUpdateAggregateCmd };
