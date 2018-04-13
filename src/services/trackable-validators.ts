import { IAggregatable } from "models/aggregatable";
import { IAggregateChildren } from "models/aggregate";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITrackable, TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import {
  validateClientId,
  validateEnum,
  validateId,
  validateLength,
  validateRange
} from "utils/common-validators";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

function validateUserId(userId: ID | undefined) {
  return validateId(userId);
}

function validateTitle(title: string | undefined) {
  return validateLength(title, { max: 255 });
}

function validateDifficulty(difficulty: Difficulty | undefined) {
  return validateEnum(difficulty, {
    values: [
      Difficulty.Easy,
      Difficulty.Medium,
      Difficulty.Hard,
      Difficulty.Impossible
    ]
  });
}

function validateProgressDisplayModeId(
  progressDisplayModeId: ProgressDisplayMode | undefined
) {
  return validateId(progressDisplayModeId);
}

function validateIconId(iconId: ID | undefined) {
  return validateId(iconId);
}

function validateChildren(
  childrenToAdd: Array<ITrackable & IAggregatable>,
  currentChildren: IAggregateChildren
) {
  if (!childrenToAdd.length) {
    return "Should not be empty";
  }

  const {
    isPublic: aggregateIsPublic,
    typeId: aggregateType
  } = currentChildren.length ? currentChildren[0] : childrenToAdd[0];

  for (const child of childrenToAdd) {
    if (child.statusId !== TrackableStatus.Active) {
      return "Should have only active items";
    }

    if (child.parentId) {
      return "Should not have items that are part of another aggregate";
    }

    if (child.isPublic !== aggregateIsPublic) {
      return "Should not have mixed public / private items";
    }

    const typeError = "Should have only counters or numerical / task goals";

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

  return undefined;
}

function validateProgressDelta(delta: number, progress: number) {
  return validateRange(delta, {
    max: Number.MAX_SAFE_INTEGER - progress
  });
}

function validateStatusIdIsActive(statusId: TrackableStatus) {
  return statusId !== TrackableStatus.Active ? "Should be active" : undefined;
}

export {
  validateUserId,
  validateTitle,
  validateDifficulty,
  validateProgressDisplayModeId,
  validateIconId,
  validateChildren,
  validateProgressDelta,
  validateStatusIdIsActive
};
