import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";
import ID from "utils/id";

interface ITaskGoalProgressChangedActivity
  extends IActivity,
    ITrackableActivity {
  taskId: ID;
}

export { ITaskGoalProgressChangedActivity };
