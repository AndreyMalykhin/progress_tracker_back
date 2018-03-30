import Bottle from "bottlejs";
import Knex from "knex";
import { IEnvConfig, makeEnvConfig } from "utils/env-config";
import makeDb from "utils/make-db";

class DIContainer {
  private impl: Bottle.IContainer;

  public constructor(impl: Bottle.IContainer) {
    this.impl = impl;
  }

  public get envConfig(): IEnvConfig {
    return this.impl.envConfig;
  }

  public get db(): Knex {
    return this.impl.db;
  }
}

function makeDIContainer() {
  const di = new Bottle();
  di.factory("envConfig", makeEnvConfig);
  di.serviceFactory("db", makeDb, "envConfig");
  return new DIContainer(di.container);
}

export { makeDIContainer };
export default DIContainer;
