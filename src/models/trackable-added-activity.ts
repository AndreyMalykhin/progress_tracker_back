import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";

interface ITrackableAddedActivity extends IActivity, ITrackableActivity {}

export { ITrackableAddedActivity };
