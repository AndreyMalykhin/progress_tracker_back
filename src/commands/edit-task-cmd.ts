import { validateTitle } from "commands/trackable-validators";
import Knex from "knex";
import { ITask } from "models/task";
import TaskFetcher from "services/task-fetcher";
import {
  validateClientId,
  validateId,
  validateIdAndClientId
} from "utils/common-validators";
import ConstraintViolationError, {
  throwIfNotEmpty
} from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import undefinedIfNull from "utils/undefined-if-null";
import UUID from "utils/uuid";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IEditTaskCmd = (
  input: IEditTaskCmdInput,
  transaction: Knex.Transaction
) => Promise<ITask>;

interface IEditTaskCmdInput {
  title: string;
  userId: ID;
  id?: ID;
  clientId?: UUID;
}

function makeEditTaskCmd(db: Knex, taskFetcher: TaskFetcher): IEditTaskCmd {
  return async (input, transaction) => {
    const task = await taskFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      input.userId,
      transaction
    );
    validateInput(input, task);
    const dataToUpdate = {
      title: input.title
    };
    const rows = await db(DbTable.Tasks)
      .transacting(transaction)
      .update(dataToUpdate, "*")
      .where("id", task!.id);
    return rows[0];
  };
}

function validateInput(input: IEditTaskCmdInput, task: ITask | undefined) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, task, errors);
  setError(errors, "title", validateTitle(input.title));
  throwIfNotEmpty(errors);
}

export { makeEditTaskCmd, IEditTaskCmd };
