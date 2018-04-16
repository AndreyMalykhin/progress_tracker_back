import Knex from "knex";
import { IAvatar } from "models/avatar";
import { IUser } from "models/user";
import AvatarFetcher from "services/avatar-fetcher";
import UserFetcher from "services/user-fetcher";
import {
  validateId,
  validateIdAndClientId,
  validateLength
} from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import undefinedIfNull from "utils/undefined-if-null";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

type IEditUserCmd = (
  input: IEditUserCmdInput,
  transaction: Knex.Transaction
) => Promise<IUser>;

interface IEditUserCmdInput {
  id: ID;
  name?: string;
  avatar?: { id?: ID; clientId?: UUID };
}

function makeEditUserCmd(
  db: Knex,
  userFetcher: UserFetcher,
  avatarFetcher: AvatarFetcher
): IEditUserCmd {
  return async (input, transaction) => {
    const user = await userFetcher.get(input.id, transaction);
    const avatar =
      input.avatar &&
      (await avatarFetcher.getByIdOrClientId(
        input.avatar.id,
        input.avatar.clientId,
        input.id,
        transaction
      ));
    validateInput(input, user, avatar);
    const rows = await db(DbTable.Users)
      .transacting(transaction)
      .update(
        {
          avatarId: avatar ? avatar.id : undefined,
          name: undefinedIfNull(input.name)
        } as IUser,
        "*"
      )
      .where("id", input.id);
    return rows[0];
  };
}

function validateInput(
  input: IEditUserCmdInput,
  user: IUser | undefined,
  avatar: IAvatar | undefined
) {
  const errors: IValidationErrors = {};
  setError(errors, "id", validateId(user && user.id));

  if (input.avatar) {
    const avatarErrors: IValidationErrors = {};
    validateIdAndClientId(input.avatar, avatar, avatarErrors);
    setError(errors, "avatar", avatarErrors);
  }

  setError(
    errors,
    "name",
    validateLength(input.name, { max: 128, isOptional: true })
  );
  throwIfNotEmpty(errors);
}

export { makeEditUserCmd, IEditUserCmd };
