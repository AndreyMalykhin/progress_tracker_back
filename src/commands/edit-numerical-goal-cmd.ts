import {
  IEditGoalCmdInput,
  validateInput
} from "commands/edit-goal-cmd-helpers";
import Knex from "knex";
import Difficulty from "models/difficulty";
import { INumericalGoal } from "models/numerical-goal";
import ProgressDisplayMode from "models/progress-display-mode";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
import {
  validateDifficulty,
  validateIconId,
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

type IEditNumericalGoalCmdInput = IEditGoalCmdInput;

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

export { makeEditNumericalGoalCmd, IEditNumericalGoalCmd };
