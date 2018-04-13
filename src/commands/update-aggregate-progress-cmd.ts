import Knex from "knex";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";

type IUpdateAggregateProgressCmd = (
  input: { id: ID; children?: IAggregateChildren },
  transaction: Knex.Transaction
) => Promise<IAggregate>;

function makeUpdateAggregateProgressCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IUpdateAggregateProgressCmd {
  return async (input, transaction) => {
    const children =
      input.children ||
      (await trackableFetcher.getByParentId(input.id, transaction));
    const progress = aggregateProgress(children).current;
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update("progress", progress, "*")
      .where("id", input.id);
    return rows[0];
  };
}

export { makeUpdateAggregateProgressCmd, IUpdateAggregateProgressCmd };
