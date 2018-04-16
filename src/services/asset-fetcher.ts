import Knex from "knex";
import { IAsset } from "models/asset";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";
import safeUUID from "utils/safe-uuid";
import UUID from "utils/uuid";

class AssetFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByIdOrClientId(
    id: ID | undefined,
    clientId: UUID | undefined,
    userId?: ID,
    transaction?: Knex.Transaction
  ): Promise<IAsset | undefined> {
    const query = this.db(DbTable.Assets)
      .transacting(transaction)
      .where(q => {
        if (id) {
          q.where("id", safeId(id));
        }

        if (clientId) {
          q.orWhere("clientId", safeUUID(clientId));
        }
      })
      .first();

    if (userId) {
      query.andWhere("userId", safeId(userId));
    }

    return await query;
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
