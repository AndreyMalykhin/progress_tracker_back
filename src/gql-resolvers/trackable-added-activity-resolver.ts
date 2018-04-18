import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";

const trackableAddedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver
};

export default trackableAddedActivityResolver;
