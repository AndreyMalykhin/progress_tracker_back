import trackableResolver from "gql-resolvers/trackable-resolver";
import { IAggregate } from "models/aggregate";
import IGqlContext from "utils/gql-context";

const aggregateResolver = {
  ...trackableResolver,
  children
};

function children(aggregate: IAggregate, args: object, context: IGqlContext) {
  return context.diContainer.trackableFetcher.getByParentId(aggregate.id);
}

export default aggregateResolver;
