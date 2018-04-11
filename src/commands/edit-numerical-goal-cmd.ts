import Knex from "knex";
import Difficulty from "models/difficulty";
import { INumericalGoal } from "models/numerical-goal";
import ProgressDisplayMode from "models/progress-display-mode";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateDifficulty,
  validateIconId,
  validateIdAndClientId,
  validateProgressDisplayModeId,
  validateTitle,
  validateUserId
} from "services/trackable-validators";
import {
  validateClientId,
  validateEnum,
  validateId,
  validateLength
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import undefinedIfNull from "utils/undefined-if-null";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IEditNumericalGoalCmd = (
  input: IEditNumericalGoalCmdInput,
  transaction: Knex.Transaction
) => Promise<INumericalGoal>;

interface IEditNumericalGoalCmdInput {
  id?: ID;
  clientId?: UUID;
  title?: string;
  deadlineDate?: Date | null;
  difficulty?: Difficulty;
  iconId?: ID;
  progressDisplayModeId?: ProgressDisplayMode;
  userId: ID;
}

function makeEditNumericalGoalCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IEditNumericalGoalCmd {
  return async (input, transaction) => {
    const goal = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      TrackableType.NumericalGoal,
      input.userId,
      transaction
    );
    validateInput(input, goal as INumericalGoal);
    const dataToUpdate: Partial<INumericalGoal> = {
      deadlineDate: input.deadlineDate,
      difficulty: undefinedIfNull(input.difficulty),
      iconId: undefinedIfNull(input.iconId),
      progressDisplayModeId: undefinedIfNull(input.progressDisplayModeId),
      title: undefinedIfNull(input.title)
    };
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update(dataToUpdate, "*")
      .where("id", goal!.id);
    return rows[0];
  };
}

function validateInput(
  input: IEditNumericalGoalCmdInput,
  goal?: INumericalGoal
) {
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

export { makeEditNumericalGoalCmd, IEditNumericalGoalCmd };
