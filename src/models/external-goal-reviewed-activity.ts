import { IActivity } from "models/activity";
import ReviewStatus from "models/review-status";
import { ITrackableActivity } from "models/trackable-activity";

interface IExternalGoalReviewedActivity extends IActivity, ITrackableActivity {
  reviewStatusId: ReviewStatus;
  ratingDelta: number;
}

export { IExternalGoalReviewedActivity };
