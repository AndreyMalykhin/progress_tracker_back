import Knex from "knex";
import { rewardableReviewsPerDay } from "models/user";
import DbTable from "utils/db-table";
import { makeLog } from "utils/log";

type IResetRewardableReviewCountCmd = (
  transaction: Knex.Transaction
) => Promise<void>;

const log = makeLog("reset-rewardable-review-count");

function makeResetRewardableReviewCountCmd() {
  const resetRewardableReviewCountCmd: IResetRewardableReviewCountCmd = async transaction => {
    const updatedUserCount = await transaction(DbTable.Users)
      .update("rewardableReviewsLeft", rewardableReviewsPerDay)
      .where("rewardableReviewsLeft", "!=", rewardableReviewsPerDay);
    log.trace(
      "resetRewardableReviewCountCmd",
      "updatedUserCount=%o",
      updatedUserCount
    );
  };
  return resetRewardableReviewCountCmd;
}

export { makeResetRewardableReviewCountCmd, IResetRewardableReviewCountCmd };
