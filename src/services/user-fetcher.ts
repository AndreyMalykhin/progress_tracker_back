import Knex from "knex";
import Audience from "models/audience";
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

  public async getLeaders(
    audience: Audience.Global | Audience.Friends,
    viewerId?: ID,
    offset = 0,
    limit = 16
  ): Promise<Array<IUser & { index: number }>> {
    const query = this.db(DbTable.Users + " as u")
      .select(
        "u.*",
        this.db.raw("row_number() over(order by ?? desc) as ??", [
          "u.rating",
          "index"
        ])
      )
      .orderBy("u.rating", "desc")
      .where("u.rating", ">", 0)
      .offset(offset)
      .limit(limit);

    switch (audience) {
      case Audience.Friends:
        if (!viewerId) {
          return [];
        }

        query.innerJoin(DbTable.Friendships + " as f", {
          "f.srcId": safeId(viewerId),
          "f.targetId": "u.id"
        });
        break;
      case Audience.Global:
        break;
      default:
        return [];
    }

    return await query;
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
