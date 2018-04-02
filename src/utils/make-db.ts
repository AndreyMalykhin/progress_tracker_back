import knex from "knex";
import { IEnvConfig } from "utils/env-config";

function makeDb(envConfig: IEnvConfig) {
  return knex(require("utils/db-config")[envConfig.env]);
}

export default makeDb;
