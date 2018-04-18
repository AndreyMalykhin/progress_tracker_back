import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";

interface IGoalApprovedActivity extends IActivity, ITrackableActivity {
  ratingDelta?: number;
}

export { IGoalApprovedActivity };
