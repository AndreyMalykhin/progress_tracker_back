import primitiveTrackableResolver from "gql-resolvers/primitive-trackable-resolver";
import trackableResolver from "gql-resolvers/trackable-resolver";
import { IGymExercise } from "models/gym-exercise";
import IGqlContext from "utils/gql-context";

const gymExerciseResolver = {
  ...trackableResolver,
  ...primitiveTrackableResolver,
  recentEntries
};

function recentEntries(
  gymExercise: IGymExercise,
  args: object,
  context: IGqlContext
) {
  return context.diContainer.gymExerciseEntryFetcher.getByGymExerciseId(
    gymExercise.id
  );
}

export default gymExerciseResolver;
