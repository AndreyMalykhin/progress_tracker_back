import Knex from "knex";
import { IMute } from "models/mute";
import { IUser } from "models/user";
import { IUserReport } from "models/user-report";
import { IFacebookUser } from "services/facebook";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";

class UserFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async get(
    id: ID,
    transaction?: Knex.Transaction
  ): Promise<IUser | undefined> {
    return await this.db(DbTable.Users)
      .transacting(transaction)
      .where("id", safeId(id))
      .first();
  }

  public async getByIds(ids: ID[]): Promise<IUser[]> {
    return await this.db(DbTable.Users).whereIn("id", ids.map(safeId));
  }

  public async getFriends(userId: ID): Promise<IUser[]> {
    return await this.db(DbTable.Users + " as u")
      .select("u.*")
      .innerJoin(DbTable.Friendships + " as f", {
        "f.srcId": safeId(userId),
        "f.targetId": "u.id"
      });
  }

  public async getByFacebookId(
    facebookId: string,
    transaction?: Knex.Transaction
  ): Promise<IUser | undefined> {
    return await this.db(DbTable.Users)
      .transacting(transaction)
      .where("facebookId", facebookId)
      .first();
  }
}

export default UserFetcher;
