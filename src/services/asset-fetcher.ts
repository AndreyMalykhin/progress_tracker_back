import Knex from "knex";
import { IAsset } from "models/asset";
import ID from "utils/id";
import safeId from "utils/safe-id";

class AssetFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async get(id: ID): Promise<IAsset | undefined> {
    return await this.db("assets")
      .where("id", safeId(id))
      .first();
  }

  public async getByIds(ids: ID[]): Promise<IAsset[]> {
    return await this.db("assets").whereIn("id", ids.map(safeId));
  }
}

export default AssetFetcher;
