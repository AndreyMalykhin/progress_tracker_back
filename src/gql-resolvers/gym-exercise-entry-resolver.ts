import { IGymExerciseEntry } from "models/gym-exercise-entry";
import IGqlContext from "utils/gql-context";

const gymExerciseEntryResolver = {
  gymExercise
};

function gymExercise(
  entry: IGymExerciseEntry,
  args: object,
  context: IGqlContext
) {
  return context.loaderMap.trackable.load(entry.gymExerciseId);
}

export default gymExerciseEntryResolver;
