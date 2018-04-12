import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";

interface ICounterProgressChangedActivity
  extends IActivity,
    ITrackableActivity {
  progressDelta: number;
}

export { ICounterProgressChangedActivity };
