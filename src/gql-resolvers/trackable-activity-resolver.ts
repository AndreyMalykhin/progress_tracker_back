import { ITrackableActivity } from "models/trackable-activity";
import IGqlContext from "utils/gql-context";

const trackableActivityResolver = {
  trackable
};

function trackable(
  activity: ITrackableActivity,
  args: object,
  context: IGqlContext
) {
  return context.loaderMap.trackable.load(activity.trackableId);
}

export default trackableActivityResolver;
