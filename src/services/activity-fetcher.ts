import Knex from "knex";
import { IActivity } from "models/activity";
import Audience from "models/audience";
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
    afterDate?: Date,
    limit = 16
  ): Promise<IActivity[]> {
    const query = this.db(DbTable.Activities + " as a")
      .select("a.*")
      .orderBy("a.date", "desc")
      .limit(limit);

    if (afterDate) {
      query.where("a.date", "<", afterDate);
    }

    switch (audience) {
      case Audience.Friends:
        query.innerJoin(DbTable.Friendships + " as f", {
          "f.srcId": safeId(viewerId),
          "f.targetId": "a.userId"
        });
        query.andWhere("a.isPublic", true);
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
