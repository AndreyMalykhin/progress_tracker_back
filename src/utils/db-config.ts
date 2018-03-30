import { Config, MigratorConfig, SeedsConfig } from "knex";

const migrations: MigratorConfig = {
  directory: "../migrations",
  extension: "ts"
};
const seeds: SeedsConfig = {
  directory: "../seeds"
};
const dbConfig: { [env: string]: Config } = {
  development: {
    client: "pg",
    connection: {},
    debug: true,
    migrations,
    seeds,
    useNullAsDefault: true
  },
  production: {
    client: "pg",
    connection: {},
    migrations,
    seeds,
    useNullAsDefault: true
  }
};

module.exports = dbConfig;
