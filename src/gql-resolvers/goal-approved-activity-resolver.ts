import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";

const goalApprovedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver
};

export default goalApprovedActivityResolver;
