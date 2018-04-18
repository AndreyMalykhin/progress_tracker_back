import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";
import { ICounterProgressChangedActivity } from "models/counter-progress-changed-activity";
import { makeRedirectResolver } from "utils/gql-resolver-utils";

const counterProgressChangedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver,
  delta: makeRedirectResolver<ICounterProgressChangedActivity>("progressDelta")
};

export default counterProgressChangedActivityResolver;
