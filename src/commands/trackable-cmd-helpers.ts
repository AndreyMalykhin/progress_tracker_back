import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import ID from "utils/id";
import { IValidationErrors, setError } from "utils/validation-result";
import { validateEnum, validateReference } from "utils/validators";

function validateDifficulty(difficulty: Difficulty, errors: IValidationErrors) {
  setError(
    errors,
    "difficulty",
    validateEnum(difficulty, {
      values: [
        Difficulty.Easy,
        Difficulty.Medium,
        Difficulty.Hard,
        Difficulty.Impossible
      ]
    })
  );
}

function validateProgressDisplayMode(
  progressDisplayModeId: ProgressDisplayMode,
  errors: IValidationErrors
) {
  setError(
    errors,
    "progressDisplayModeId",
    validateReference(progressDisplayModeId)
  );
}

function validateIcon(iconId: ID, errors: IValidationErrors) {
  setError(errors, "iconId", validateReference(iconId));
}

export { validateIcon, validateDifficulty, validateProgressDisplayMode };
