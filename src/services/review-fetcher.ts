import Knex from "knex";
import { IReview } from "models/review";
import ReviewStatus from "models/review-status";
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

  public async getDifficultySumByTrackableId(
    id: ID,
    transaction?: Knex.Transaction
  ): Promise<{
    approveCount: number;
    difficultySum: number;
  }> {
    return await this.db(DbTable.Reviews)
      .transacting(transaction)
      .select(
        this.db.raw("count(??) as ??", ["userId", "approveCount"]),
        this.db.raw("sum(??) as ??", ["difficulty", "difficultySum"])
      )
      .where({ trackableId: safeId(id), statusId: ReviewStatus.Approved })
      .first();
  }
}

export default ReviewFetcher;
