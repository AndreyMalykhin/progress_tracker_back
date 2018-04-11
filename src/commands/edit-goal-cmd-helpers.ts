import Difficulty from "models/difficulty";
import { IGoal } from "models/goal";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITrackable } from "models/trackable";
import {
  validateDifficulty,
  validateIconId,
  validateProgressDisplayModeId,
  validateTitle,
  validateUserId
} from "services/trackable-validators";
import { validateIdAndClientId } from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import ID from "utils/id";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

interface IEditGoalCmdInput {
  id?: ID;
  clientId?: UUID;
  title?: string;
  deadlineDate?: Date | null;
  difficulty?: Difficulty;
  iconId?: ID;
  progressDisplayModeId?: ProgressDisplayMode;
  userId: ID;
}

function validateInput(input: IEditGoalCmdInput, goal?: ITrackable & IGoal) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, goal, errors);
  setError(errors, "userId", validateUserId(input.userId));

  if (input.title != null) {
    setError(errors, "title", validateTitle(input.title));
  }

  if (input.difficulty != null) {
    setError(errors, "difficulty", validateDifficulty(input.difficulty));
  }

  if (input.progressDisplayModeId != null) {
    setError(
      errors,
      "progressDisplayModeId",
      validateProgressDisplayModeId(input.progressDisplayModeId)
    );
  }

  if (input.iconId != null) {
    setError(errors, "iconId", validateIconId(input.iconId));
  }

  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

export { validateInput, IEditGoalCmdInput };
