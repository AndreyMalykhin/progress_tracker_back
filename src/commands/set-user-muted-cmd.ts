import Knex from "knex";
import { IUser } from "models/user";
import MuteFetcher from "services/mute-fetcher";
import UserFetcher from "services/user-fetcher";
import { validateId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import isIdEqual from "utils/is-id-equal";
import { IValidationErrors, setError } from "utils/validation-result";

type ISetUserMutedCmd = (
  input: ISetUserMutedCmdInput,
  transaction: Knex.Transaction
) => Promise<IUser>;

interface ISetUserMutedCmdInput {
  srcId: ID;
  targetId: ID;
  isMuted: boolean;
}

function makeSetUserMutedCmd(
  db: Knex,
  muteFetcher: MuteFetcher,
  userFetcher: UserFetcher
): ISetUserMutedCmd {
  return async (input, transaction) => {
    const { srcId, targetId, isMuted } = input;
    const target = await userFetcher.get(targetId, transaction);
    validateInput(input, target);
    const mute = await muteFetcher.get(targetId, srcId);

    if (isMuted === !!mute) {
      return target!;
    }

    if (isMuted) {
      await db(DbTable.Mutes)
        .transacting(transaction)
        .insert({ srcId, targetId });
    } else {
      await db(DbTable.Mutes)
        .transacting(transaction)
        .delete()
        .where({ srcId, targetId });
    }

    return target!;
  };
}

function validateInput(
  input: ISetUserMutedCmdInput,
  target: IUser | undefined
) {
  const errors: IValidationErrors = {};
  setError(errors, "srcId", validateId(input.srcId));
  let targetError = validateId(target && target.id);

  if (isIdEqual(input.srcId, input.targetId)) {
    targetError = targetError || "Should be another user";
  }

  setError(errors, "targetId", targetError);
  throwIfNotEmpty(errors);
}

export { makeSetUserMutedCmd, ISetUserMutedCmd };
