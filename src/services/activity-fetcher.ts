import Knex from "knex";
import { IActivity } from "models/activity";
import Audience from "models/audience";
import { IDbCursor } from "utils/db-cursor";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";

class ActivityFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByAudience(
    audience: Audience.Friends | Audience.Me,
    viewerId: ID,
    afterCursor?: IDbCursor<Date>,
    limit = 16
  ): Promise<IActivity[]> {
    const query = this.db(DbTable.Activities + " as a")
      .select("a.*")
      .orderByRaw("row(??, ??) desc", ["a.date", "a.id"])
      .limit(limit);

    if (afterCursor) {
      query.whereRaw("row(??, ??) < row(?, ?)::timestamp_cursor", [
        "a.date",
        "a.id",
        afterCursor.value,
        afterCursor.id
      ]);
    }

    switch (audience) {
      case Audience.Friends:
        query
          .innerJoin(DbTable.Friendships + " as f", {
            "f.srcId": safeId(viewerId),
            "f.targetId": "a.userId"
          })
          .leftJoin(DbTable.Mutes + " as m", {
            "m.srcId": safeId(viewerId),
            "m.targetId": "a.userId"
          })
          .andWhereRaw(this.db.raw("?? is null", "m.targetId"))
          .andWhere("a.isPublic", true);
        break;
      case Audience.Me:
        query.andWhere("a.userId", safeId(viewerId));
        break;
      default:
        return [];
    }

    return await query;
  }
}

export default ActivityFetcher;
