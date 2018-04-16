import { IEditGoalCmdInput, validateInput } from "commands/edit-goal-cmd";
import {
  validateDifficulty,
  validateIconId,
  validateProgressDisplayModeId,
  validateTitle,
  validateUserId
} from "commands/trackable-validators";
import Knex from "knex";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import { ITaskGoal } from "models/task-goal";
import { TrackableType } from "models/trackable";
import TrackableFetcher from "services/trackable-fetcher";
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

type IEditTaskGoalCmd = (
  input: IEditTaskGoalCmdInput,
  transaction: Knex.Transaction
) => Promise<ITaskGoal>;

type IEditTaskGoalCmdInput = IEditGoalCmdInput;

function makeEditTaskGoalCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IEditTaskGoalCmd {
  return async (input, transaction) => {
    const goal = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      TrackableType.TaskGoal,
      input.userId,
      transaction
    );
    validateInput(input, goal as ITaskGoal);
    const dataToUpdate = {
      deadlineDate: input.deadlineDate,
      difficulty: undefinedIfNull(input.difficulty),
      iconId: undefinedIfNull(input.iconId),
      progressDisplayModeId: undefinedIfNull(input.progressDisplayModeId),
      title: undefinedIfNull(input.title)
    } as ITaskGoal;
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update(dataToUpdate, "*")
      .where("id", goal!.id);
    return rows[0];
  };
}

export { makeEditTaskGoalCmd, IEditTaskGoalCmd };
