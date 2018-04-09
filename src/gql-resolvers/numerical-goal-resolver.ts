import aggregatableResolver from "gql-resolvers/aggregatable-resolver";
import goalResolver from "gql-resolvers/goal-resolver";
import primitiveTrackableResolver from "gql-resolvers/primitive-trackable-resolver";
import trackableResolver from "gql-resolvers/trackable-resolver";

const numericalGoalResolver = {
  ...trackableResolver,
  ...primitiveTrackableResolver,
  ...aggregatableResolver,
  ...goalResolver
};

export default numericalGoalResolver;
