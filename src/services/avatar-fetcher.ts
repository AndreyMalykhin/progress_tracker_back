import Knex from "knex";
import { IAvatar } from "models/avatar";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";
import safeUUID from "utils/safe-uuid";
import UUID from "utils/uuid";

class AvatarFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async get(id: ID): Promise<IAvatar | undefined> {
    return await this.db("avatars")
      .where("id", safeId(id))
      .first();
  }

  public async getByIdOrClientId(
    id: ID | undefined,
    clientId: UUID | undefined,
    userId?: ID,
    transaction?: Knex.Transaction
  ): Promise<IAvatar | undefined> {
    const query = await this.db(DbTable.Avatars)
      .transacting(transaction)
      .where(q => {
        if (id) {
          q.where("id", safeId(id));
        }

        if (clientId) {
          q.andWhere("clientId", safeUUID(clientId));
        }
      })
      .first();

    if (userId) {
      query.andWhere("userId", safeId(userId));
    }

    return await query;
  }

  public async getByIds(ids: ID[]): Promise<IAvatar[]> {
    return await this.db("avatars").whereIn("id", ids.map(safeId));
  }
}

export default AvatarFetcher;
