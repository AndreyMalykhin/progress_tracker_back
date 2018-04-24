import Knex from "knex";
import { ActivityType } from "models/activity";
import { IGoal } from "models/goal";
import { IGoalApprovedActivity } from "models/goal-approved-activity";
import { IGoalRejectedActivity } from "models/goal-rejected-activity";
import { ITrackable } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import { bonusRatingForReview, rewardableReviewsPerDay } from "models/user";
import ReviewFetcher from "services/review-fetcher";
import DbTable from "utils/db-table";
import ID from "utils/id";
import { makeLog } from "utils/log";

type IEvaluateTrackableCmd = (
  trackable: ITrackable & IGoal,
  transaction: Knex.Transaction
) => Promise<void>;

const log = makeLog("evaluate-trackable-cmd");

function makeEvaluateTrackableCmd(reviewFetcher: ReviewFetcher) {
  const evaluateTrackableCmd: IEvaluateTrackableCmd = async (
    trackable,
    transaction
  ) => {
    log.trace("evaluateTrackableCmd");
    let bonusRating: number | undefined;
    const statusChangeDate = new Date();
    let statusId = TrackableStatus.Rejected;
    const estimatedDifficulty = await estimateDifficulty(
      trackable,
      reviewFetcher,
      transaction
    );
    const promises: Array<Promise<void>> = [];

    if (trackable.approveCount! > trackable.rejectCount!) {
      bonusRating = getBonusRating(estimatedDifficulty);
      statusId = TrackableStatus.Approved;
      promises.push(
        addApprovalActivity(
          trackable.id,
          trackable.userId,
          bonusRating,
          transaction
        )
      );
    } else {
      promises.push(
        addRejectionActivity(trackable.id, trackable.userId, transaction)
      );
    }

    promises.push(
      updateTrackable(
        trackable.id,
        estimatedDifficulty,
        bonusRating,
        statusChangeDate,
        statusId,
        transaction
      )
    );

    if (bonusRating != null) {
      promises.push(updateUser(trackable.userId, bonusRating, transaction));
    }

    await Promise.all(promises);
  };
  return evaluateTrackableCmd;
}

function getBonusRating(estimatedDifficulty: number) {
  return Math.ceil(
    Math.pow(4, estimatedDifficulty + 1) *
      4 *
      rewardableReviewsPerDay *
      bonusRatingForReview
  );
}

async function estimateDifficulty(
  trackable: ITrackable & IGoal,
  reviewFetcher: ReviewFetcher,
  transaction: Knex.Transaction
) {
  const {
    approveCount,
    difficultySum
  } = await reviewFetcher.getDifficultySumByTrackableId(
    trackable.id,
    transaction
  );
  return (difficultySum + trackable.difficulty) / (approveCount + 1);
}

async function addApprovalActivity(
  trackableId: ID,
  userId: ID,
  ratingDelta: number,
  transaction: Knex.Transaction
) {
  await transaction(DbTable.Activities).insert({
    isPublic: true,
    ratingDelta,
    trackableId,
    typeId: ActivityType.GoalApproved,
    userId
  } as IGoalApprovedActivity);
}

async function addRejectionActivity(
  trackableId: ID,
  userId: ID,
  transaction: Knex.Transaction
) {
  await transaction(DbTable.Activities).insert({
    isPublic: true,
    trackableId,
    typeId: ActivityType.GoalRejected,
    userId
  } as IGoalRejectedActivity);
}

async function updateUser(
  userId: ID,
  bonusRating: number,
  transaction: Knex.Transaction
) {
  await transaction(DbTable.Users)
    .update("rating", transaction.raw("?? + ?", ["rating", bonusRating]))
    .where("id", userId);
}

async function updateTrackable(
  id: ID,
  estimatedDifficulty: number,
  rating: number | undefined,
  statusChangeDate: Date,
  statusId: TrackableStatus,
  transaction: Knex.Transaction
) {
  await transaction(DbTable.Trackables)
    .update({
      estimatedDifficulty,
      rating,
      statusChangeDate,
      statusId
    } as ITrackable & IGoal)
    .where("id", id);
}

export { makeEvaluateTrackableCmd, IEvaluateTrackableCmd };
