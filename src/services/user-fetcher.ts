import Knex from "knex";
import { IMute } from "models/mute";
import { IUser } from "models/user";
import { IUserReport } from "models/user-report";
import { IFacebookUser } from "services/facebook";
import DbTable from "utils/db-table";
import ID from "utils/id";

class UserFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByIds(ids: ID[]): Promise<IUser[]> {
    return await this.db(DbTable.Users).whereIn("id", ids);
  }

  public async getFriends(userId: ID): Promise<IUser[]> {
    return await this.db(DbTable.Users + " as u")
      .select("u.*")
      .innerJoin(DbTable.Friendships + " as f", "f.targetId", "u.id")
      .where("f.srcId", userId);
  }

  public async getByFacebookId(facebookId: ID): Promise<IUser | undefined> {
    return await this.db(DbTable.Users)
      .where("facebookId", facebookId)
      .first();
  }
}

export default UserFetcher;
