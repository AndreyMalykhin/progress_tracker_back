import Knex from "knex";
import { IMute } from "models/mute";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";

class MuteFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async get(
    mutedId: ID,
    viewerId: ID | undefined
  ): Promise<IMute | undefined> {
    if (!viewerId) {
      return undefined;
    }

    return await this.db(DbTable.Mutes)
      .where({ srcId: safeId(viewerId), targetId: safeId(mutedId) })
      .first();
  }
}

export default MuteFetcher;
