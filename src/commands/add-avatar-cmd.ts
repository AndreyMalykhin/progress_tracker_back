import Knex from "knex";
import { IAvatar } from "models/avatar";
import DbTable from "utils/db-table";

type IAddAvatarCmd = (
  input: ICmdInput,
  transaction: Knex.Transaction
) => Promise<IAvatar>;

interface ICmdInput {
  urlSmall: string;
  urlMedium: string;
}

function makeAddAvatarCmd(db: Knex) {
  return async (input: ICmdInput, transaction: Knex.Transaction) => {
    const { urlSmall, urlMedium } = input;
    const rows = await db(DbTable.Avatars)
      .transacting(transaction)
      .insert({ urlSmall, urlMedium }, "*");
    return rows[0];
  };
}

export { makeAddAvatarCmd, IAddAvatarCmd };
