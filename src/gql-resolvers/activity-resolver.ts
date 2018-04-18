import { ActivityType, IActivity } from "models/activity";
import IGqlContext from "utils/gql-context";

const activityResolver = {
  __resolveType,
  user
};

function __resolveType(activity: IActivity) {
  switch (activity.typeId) {
    case ActivityType.CounterProgressChanged:
      return "CounterProgressChangedActivity";
    case ActivityType.ExternalGoalReviewed:
      return "ExternalGoalReviewedActivity";
    case ActivityType.GoalAchieved:
      return "GoalAchievedActivity";
    case ActivityType.GoalApproved:
      return "GoalApprovedActivity";
    case ActivityType.GoalRejected:
      return "GoalRejectedActivity";
    case ActivityType.GymExerciseEntryAdded:
      return "GymExerciseEntryAddedActivity";
    case ActivityType.NumericalGoalProgressChanged:
      return "NumericalGoalProgressChangedActivity";
    case ActivityType.TaskGoalProgressChanged:
      return "TaskGoalProgressChangedActivity";
    case ActivityType.TrackableAdded:
      return "TrackableAddedActivity";
  }

  return null;
}

function user(activity: IActivity, args: object, context: IGqlContext) {
  return context.loaderMap.user.load(activity.userId);
}

export default activityResolver;
