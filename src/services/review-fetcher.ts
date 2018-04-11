import Knex from "knex";
import { IReview } from "models/review";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";

class ReviewFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async get(trackableId: ID, userId: ID): Promise<IReview | undefined> {
    return await this.db(DbTable.Reviews)
      .where({ userId: safeId(userId), trackableId: safeId(trackableId) })
      .first();
  }
}

export default ReviewFetcher;
