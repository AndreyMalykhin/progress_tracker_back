import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";

interface INumericalGoalProgressChangedActivity
  extends IActivity,
    ITrackableActivity {
  progressDelta: number;
}

export { INumericalGoalProgressChangedActivity };
