import { IAggregateChildren } from "models/aggregate";
import { IGoal } from "models/goal";
import { TrackableType } from "models/trackable";

function aggregateProgress(trackables: IAggregateChildren) {
  let current = 0;
  let max;

  if (trackables[0].typeId === TrackableType.Counter) {
    for (const trackable of trackables) {
      current += trackable.progress;
    }
  } else {
    const trackableCount = trackables.length;
    max = 1;

    for (const trackable of trackables) {
      const trackableNormalizedProgress =
        trackable.progress / (trackable as IGoal).maxProgress;
      current += trackableNormalizedProgress / trackableCount;
    }
  }

  return { current, max };
}

export default aggregateProgress;
