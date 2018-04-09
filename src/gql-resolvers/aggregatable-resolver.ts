import { IAggregatable } from "models/aggregatable";
import IGqlContext from "utils/gql-context";

const aggregatableResolver = {
  parent
};

function parent(trackable: IAggregatable, args: object, context: IGqlContext) {
  return (
    trackable.parentId && context.loaderMap.trackable.load(trackable.parentId)
  );
}

export default aggregatableResolver;
