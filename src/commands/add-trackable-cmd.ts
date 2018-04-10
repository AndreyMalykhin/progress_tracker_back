import Knex from "knex";
import { ActivityType } from "models/activity";
import { ITrackable } from "models/trackable";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import {
  validateClientId,
  validateLength,
  validateReference
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import IGqlContext from "utils/gql-context";
import ID from "utils/id";
import { isEmpty, IValidationErrors, setError } from "utils/validation-result";

type IAddTrackableCmd<
  TTrackable extends ITrackable,
  TInput extends IAddTrackableCmdInput
> = (input: TInput, transaction: Knex.Transaction) => Promise<TTrackable>;

interface IAddTrackableCmdInput {
  clientId?: ID;
  title: string;
  userId: ID;
}

function makeAddTrackableCmd<
  TInput extends IAddTrackableCmdInput,
  TTrackable extends ITrackable
>(
  db: Knex,
  validateInput: (input: TInput, errors: IValidationErrors) => Promise<void>,
  inputToTrackable: (input: TInput) => Promise<Partial<TTrackable>>,
  afterAdd?: (
    input: TInput,
    trackable: TTrackable,
    transaction: Knex.Transaction,
    db: Knex
  ) => Promise<void>,
  dontAddActivity = false
): IAddTrackableCmd<TTrackable, TInput> {
  return async (input, transaction) => {
    await validate(input, validateInput);
    const inputTrackable = await inputToTrackable(input);
    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .insert(inputTrackable, "*");
    const outputTrackable: TTrackable = rows[0];

    if (afterAdd) {
      await afterAdd(input, outputTrackable, transaction, db);
    }

    if (!dontAddActivity) {
      await addTrackableAddedActivity(
        outputTrackable.id,
        outputTrackable.userId,
        transaction,
        db
      );
    }

    return outputTrackable;
  };
}

async function validate<TInput extends IAddTrackableCmdInput>(
  input: TInput,
  doValidate: (input: TInput, errors: IValidationErrors) => Promise<void>
) {
  const { clientId, userId, title } = input;
  const errors: IValidationErrors = {};
  setError(
    errors,
    "clientId",
    validateClientId(clientId, { isOptional: true })
  );
  setError(errors, "userId", validateReference(userId));
  setError(errors, "title", validateLength(title, { max: 255 }));
  await doValidate(input, errors);

  if (!isEmpty(errors)) {
    throw new ConstraintViolationError("Invalid input", { errors });
  }
}

async function addTrackableAddedActivity(
  trackableId: ID,
  userId: ID,
  transaction: Knex.Transaction,
  db: Knex
): Promise<ITrackableAddedActivity> {
  const activity = {
    trackableId,
    typeId: ActivityType.TrackableAdded,
    userId
  };
  const rows = await db(DbTable.Activities)
    .transacting(transaction)
    .insert(activity, "*");
  return rows[0];
}

export { makeAddTrackableCmd, IAddTrackableCmdInput, IAddTrackableCmd };
