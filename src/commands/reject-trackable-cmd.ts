import { validateNotReviewed } from "commands/review-validators";
import rewardUserForReview from "commands/reward-user-for-review";
import {
  validateDifficulty,
  validateStatusIdIsPendingReview,
  validateUserId
} from "commands/trackable-validators";
import Knex from "knex";
import { ActivityType } from "models/activity";
import Difficulty from "models/difficulty";
import { IExternalGoalReviewedActivity } from "models/external-goal-reviewed-activity";
import { IGoal } from "models/goal";
import RejectReason from "models/reject-reason";
import { IRejection } from "models/rejection";
import { IReview } from "models/review";
import ReviewStatus from "models/review-status";
import { ITrackable } from "models/trackable";
import { bonusRatingForReview, IUser } from "models/user";
import ReviewFetcher from "services/review-fetcher";
import TrackableFetcher from "services/trackable-fetcher";
import UserFetcher from "services/user-fetcher";
import { validateEnum, validateIdAndClientId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

type IRejectTrackableCmd = (
  input: IRejectTrackableCmdInput,
  transaction: Knex.Transaction
) => Promise<{
  trackable: ITrackable;
  user: IUser;
  bonusRating: number;
}>;

interface IRejectTrackableCmdInput {
  id?: ID;
  clientId?: UUID;
  userId: ID;
  reasonId: RejectReason;
}

function makeRejectTrackableCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher,
  userFetcher: UserFetcher,
  reviewFetcher: ReviewFetcher
): IRejectTrackableCmd {
  return async (input, transaction) => {
    const trackableType = undefined;
    let trackable = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      trackableType,
      input.userId,
      transaction
    );
    const review = await reviewFetcher.get(trackable!.id, input.userId);
    validateInput(input, trackable, review);
    await addReview(
      trackable!.id,
      input.userId,
      input.reasonId,
      db,
      transaction
    );
    trackable = await updateTrackable(trackable!.id, db, transaction);
    const { user, bonusRating } = await rewardUserForReview(
      (await userFetcher.get(input.userId)) as IUser,
      db,
      transaction
    );
    await addActivity(input.userId, trackable.id, bonusRating, db, transaction);
    return { trackable: trackable!, user: user!, bonusRating };
  };
}

function validateInput(
  input: IRejectTrackableCmdInput,
  trackable: ITrackable | undefined,
  review: IReview | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, trackable, errors);
  const idField = input.id ? "id" : "clientId";

  if (trackable) {
    setError(
      errors,
      idField,
      validateStatusIdIsPendingReview(trackable.statusId)
    );
  }

  setError(errors, idField, validateNotReviewed(review));
  setError(errors, "userId", validateUserId(input.userId));
  setError(
    errors,
    "reasonId",
    validateEnum(input.reasonId, {
      values: [
        RejectReason.Abuse,
        RejectReason.Fake,
        RejectReason.Other,
        RejectReason.Spam
      ]
    })
  );
  throwIfNotEmpty(errors);
}

async function addReview(
  trackableId: ID,
  userId: ID,
  reasonId: RejectReason,
  db: Knex,
  transaction: Knex.Transaction
) {
  await db(DbTable.Reviews)
    .transacting(transaction)
    .insert({
      reasonId,
      statusId: ReviewStatus.Rejected,
      trackableId,
      userId
    } as IRejection);
}

async function updateTrackable(
  id: ID,
  db: Knex,
  transaction: Knex.Transaction
): Promise<ITrackable> {
  const rows = await db(DbTable.Trackables)
    .transacting(transaction)
    .update({ rejectCount: db.raw("coalesce(??, 0) + 1", "rejectCount") }, "*")
    .where("id", id);
  return rows[0];
}

async function addActivity(
  userId: ID,
  trackableId: ID,
  ratingDelta: number,
  db: Knex,
  transaction: Knex.Transaction
) {
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert({
      ratingDelta,
      reviewStatusId: ReviewStatus.Rejected,
      trackableId,
      typeId: ActivityType.ExternalGoalReviewed,
      userId
    } as IExternalGoalReviewedActivity);
}

export { makeRejectTrackableCmd, IRejectTrackableCmd };
