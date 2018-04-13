import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";

interface IGoalAchievedActivity extends IActivity, ITrackableActivity {}

export { IGoalAchievedActivity };
