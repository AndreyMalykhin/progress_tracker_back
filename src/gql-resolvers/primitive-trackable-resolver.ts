import { IPrimitiveTrackable } from "models/primitive-trackable";
import IGqlContext from "utils/gql-context";

const primitiveTrackableResolver = {
  iconName
};

async function iconName(
  trackable: IPrimitiveTrackable,
  args: object,
  context: IGqlContext
) {
  const icon = await context.loaderMap.icon.load(trackable.iconId);
  return icon.name;
}

export default primitiveTrackableResolver;
