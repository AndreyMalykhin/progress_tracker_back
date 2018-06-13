import Knex from "knex";
import Audience from "models/audience";
import { IMute } from "models/mute";
import { IUser } from "models/user";
import { IUserReport } from "models/user-report";
import { IDbCursor } from "utils/db-cursor";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";

class UserFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getBeforefriendsSyncStartDate(
    date: Date
  ): Promise<IUser | undefined> {
    return await this.db(DbTable.Users)
      .where("friendsSyncStartDate", "<", date)
      .orWhereNull("friendsSyncStartDate")
      .first();
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

  public async getFriends(
    userId: ID,
    afterCursor?: IDbCursor<string>,
    limit = 16
  ): Promise<IUser[]> {
    const query = this.db(DbTable.Users + " as u")
      .select("u.*")
      .innerJoin(DbTable.Friendships + " as f", {
        "f.srcId": this.db.raw(safeId(userId)),
        "f.targetId": "u.id"
      })
      .orderByRaw("row(??, ??) asc", ["u.name", "u.id"])
      .limit(limit);

    if (afterCursor) {
      query.whereRaw("row(??, ??) > row(?, ?)::varchar_cursor", [
        "u.name",
        "u.id",
        afterCursor.value,
        afterCursor.id
      ]);
    }

    return await query;
  }

  public async getFriendsUnordered(
    userId: ID,
    offset = 0,
    limit = 16
  ): Promise<IUser[]> {
    return await this.db(DbTable.Users + " as u")
      .select("u.*")
      .innerJoin(DbTable.Friendships + " as f", {
        "f.srcId": this.db.raw(safeId(userId)),
        "f.targetId": "u.id"
      })
      .offset(offset)
      .limit(limit);
  }

  public async getLeaders(
    audience: Audience.Global | Audience.Friends,
    viewerId?: ID,
    afterCursor?: IDbCursor<number>,
    limit = 16
  ): Promise<IUser[]> {
    const db = this.db;
    const query = db
      .from(function(this: Knex) {
        this.from(DbTable.Users + " as u")
          .select("u.*")
          .orderByRaw(db.raw("row(??, ??) desc", ["u.rating", "u.id"]))
          .where("u.rating", ">", 0)
          .limit(100)
          .as("subquery");

        switch (audience) {
          case Audience.Friends:
            if (!viewerId) {
              return [];
            }

            this.innerJoin(DbTable.Friendships + " as f", {
              "f.srcId": db.raw(safeId(viewerId)),
              "f.targetId": "u.id"
            });
            break;
          case Audience.Global:
            break;
          default:
            return [];
        }
      })
      .limit(limit);

    if (afterCursor) {
      query.andWhereRaw("row(??, ??) < row(?, ?)::integer_cursor", [
        "rating",
        "id",
        afterCursor.value,
        afterCursor.id
      ]);
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
