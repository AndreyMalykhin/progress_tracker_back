import { IAggregatable } from "models/aggregatable";
import IGraphqlContext from "utils/graphql-context";

const aggregatableResolver = {
  parent
};

function parent(
  trackable: IAggregatable,
  args: object,
  context: IGraphqlContext
) {
  return (
    trackable.parentId && context.loaderMap.trackable.load(trackable.parentId)
  );
}

export default aggregatableResolver;
