import { IPrimitiveTrackable } from "models/primitive-trackable";
import IGraphqlContext from "utils/graphql-context";

const primitiveTrackableResolver = {
  iconName
};

async function iconName(
  trackable: IPrimitiveTrackable,
  args: object,
  context: IGraphqlContext
) {
  const icon = await context.loaderMap.icon.load(trackable.iconId);
  return icon.name;
}

export default primitiveTrackableResolver;
