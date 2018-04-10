import { IAggregatable } from "models/aggregatable";
import { IAggregateChildren } from "models/aggregate";
import { ITrackable, TrackableType } from "models/trackable";
import ID from "utils/id";

const typeError = "Should have only counters or numerical / task goals";

function validateAggregateChildren(
  childrenToAdd: Array<ITrackable & IAggregatable>,
  oldChildren: IAggregateChildren
): string | undefined {
  if (!childrenToAdd.length) {
    return "Should not be empty";
  }

  const {
    isPublic: aggregateIsPublic,
    typeId: aggregateType
  } = oldChildren.length ? oldChildren[0] : childrenToAdd[0];

  for (const child of childrenToAdd) {
    if (child.parentId) {
      return "Should not be a part of another aggregate";
    }

    if (child.isPublic !== aggregateIsPublic) {
      return "Should not have mixed public / private items";
    }

    switch (child.typeId) {
      case TrackableType.Counter:
        if (aggregateType !== TrackableType.Counter) {
          return typeError;
        }

        break;
      case TrackableType.NumericalGoal:
      case TrackableType.TaskGoal:
        if (
          aggregateType !== TrackableType.NumericalGoal &&
          aggregateType !== TrackableType.TaskGoal
        ) {
          return typeError;
        }

        break;
      default:
        return typeError;
    }
  }
}

export default validateAggregateChildren;
