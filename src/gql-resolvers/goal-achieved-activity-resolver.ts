import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";

const goalAchievedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver
};

export default goalAchievedActivityResolver;
