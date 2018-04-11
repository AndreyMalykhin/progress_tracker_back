import { IAggregatable } from "models/aggregatable";
import { IAggregateChildren } from "models/aggregate";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITrackable, TrackableType } from "models/trackable";
import {
  validateClientId,
  validateEnum,
  validateId,
  validateLength
} from "utils/common-validators";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

function validateIdAndClientId(
  input: { id?: ID; clientId?: UUID },
  trackable: ITrackable | undefined,
  errors: IValidationErrors
) {
  if (!input.id && !input.clientId) {
    setError(errors, "id", 'Either "id" or "clientId" should not be empty');
  } else if (input.id) {
    setError(errors, "id", validateId(trackable && trackable.id));
  } else if (input.clientId) {
    setError(
      errors,
      "clientId",
      validateClientId(input.clientId) || validateId(trackable && trackable.id)
    );
  }
}

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
): string | undefined {
  if (!childrenToAdd.length) {
    return "Should not be empty";
  }

  const {
    isPublic: aggregateIsPublic,
    typeId: aggregateType
  } = currentChildren.length ? currentChildren[0] : childrenToAdd[0];

  for (const child of childrenToAdd) {
    if (child.parentId) {
      return "Should not be a part of another aggregate";
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
}

export {
  validateIdAndClientId,
  validateUserId,
  validateTitle,
  validateDifficulty,
  validateProgressDisplayModeId,
  validateIconId,
  validateChildren
};
