import aggregatableResolver from "gql-resolvers/aggregatable-resolver";
import primitiveTrackableResolver from "gql-resolvers/primitive-trackable-resolver";
import trackableResolver from "gql-resolvers/trackable-resolver";
import IGqlContext from "utils/gql-context";

const counterResolver = {
  ...trackableResolver,
  ...primitiveTrackableResolver,
  ...aggregatableResolver
};

export default counterResolver;
