import Knex from "knex";
import { IAsset } from "models/asset";
import ID from "utils/id";

class AssetService {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getById(id: ID): Promise<IAsset | undefined> {
    return await this.db("assets")
      .where("id", id)
      .first();
  }

  public async getByIds(ids: ID[]): Promise<IAsset[]> {
    return await this.db("assets").whereIn("id", ids);
  }
}

export default AssetService;
