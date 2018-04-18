import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";
import { INumericalGoalProgressChangedActivity } from "models/numerical-goal-progress-changed-activity";
import { makeRedirectResolver } from "utils/gql-resolver-utils";

const numericalGoalProgressChangedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver,
  delta: makeRedirectResolver<INumericalGoalProgressChangedActivity>(
    "progressDelta"
  )
};

export default numericalGoalProgressChangedActivityResolver;
