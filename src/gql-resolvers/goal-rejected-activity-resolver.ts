import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";

const goalRejectedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver
};

export default goalRejectedActivityResolver;
