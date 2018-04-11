import Knex from "knex";
import { IUserReport } from "models/user-report";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";

class UserReportFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async get(
    reportedId: ID,
    viewerId: ID | undefined
  ): Promise<IUserReport | undefined> {
    if (!viewerId) {
      return undefined;
    }

    return await this.db(DbTable.UserReports)
      .where({ reporterId: safeId(viewerId), reportedId: safeId(reportedId) })
      .first();
  }
}

export default UserReportFetcher;
