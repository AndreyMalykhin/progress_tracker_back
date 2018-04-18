import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";
import { IExternalGoalReviewedActivity } from "models/external-goal-reviewed-activity";
import ReviewStatus from "models/review-status";

const externalGoalReviewedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver,
  isApprove
};

function isApprove(activity: IExternalGoalReviewedActivity) {
  return activity.reviewStatusId === ReviewStatus.Approved;
}

export default externalGoalReviewedActivityResolver;
