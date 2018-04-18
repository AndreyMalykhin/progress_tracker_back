import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";
import { IGymExerciseEntryAddedActivity } from "models/gym-exercise-entry-added-activity";
import IGqlContext from "utils/gql-context";

const gymExerciseEntryAddedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver,
  entry
};

function entry(
  activity: IGymExerciseEntryAddedActivity,
  args: object,
  context: IGqlContext
) {
  return context.loaderMap.gymExerciseEntry.load(activity.gymExerciseEntryId);
}

export default gymExerciseEntryAddedActivityResolver;
