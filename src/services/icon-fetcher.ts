import Knex from "knex";
import { IIcon } from "models/icon";
import DbTable from "utils/db-table";
import ID from "utils/id";

class IconFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByIds(ids: ID[]): Promise<IIcon[]> {
    return await this.db(DbTable.Icons).whereIn("id", ids);
  }

  public async getByName(name: string): Promise<IIcon | undefined> {
    return await this.db(DbTable.Icons)
      .where("name", name)
      .first();
  }
}

export default IconFetcher;
