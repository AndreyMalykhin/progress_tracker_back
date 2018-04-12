import { IActivity } from "models/activity";
import { ITrackableActivity } from "models/trackable-activity";
import ID from "utils/id";

interface IGymExerciseEntryAddedActivity extends IActivity, ITrackableActivity {
  gymExerciseEntryId: ID;
}

export { IGymExerciseEntryAddedActivity };
