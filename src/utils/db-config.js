const migrations = {
  directory: "migrations"
};
const seeds = {
  directory: "seeds"
};
const dbConfig = {
  development: {
    client: "pg",
    connection: {},
    debug: false,
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
