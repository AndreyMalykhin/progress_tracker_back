import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";

interface IGoalRejectedActivity extends IActivity, ITrackableActivity {}

export { IGoalRejectedActivity };
