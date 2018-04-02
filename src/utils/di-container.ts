import Bottle from "bottlejs";
import Knex from "knex";
import AvatarService from "services/avatar-service";
import FacebookService from "services/facebook-service";
import FriendSynchronizer from "services/friend-synchronizer";
import UserService from "services/user-service";
import { IEnvConfig, makeEnvConfig } from "utils/env-config";
import { IFetcher, makeFetcher } from "utils/fetcher";
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

  public get facebookService(): FacebookService {
    return this.impl.facebookService;
  }

  public get userService(): UserService {
    return this.impl.userService;
  }

  public get avatarService(): AvatarService {
    return this.impl.avatarService;
  }

  public get friendSynchronizer(): FriendSynchronizer {
    return this.impl.friendSynchronizer;
  }

  public get fetcher(): IFetcher {
    return this.impl.fetcher;
  }
}

function makeDIContainer() {
  const di = new Bottle();
  di.factory("envConfig", makeEnvConfig);
  di.serviceFactory("db", makeDb, "envConfig");
  di.service("fetcher", makeFetcher);
  di.service("avatarService", AvatarService, "db");
  di.service("facebookService", FacebookService, "fetcher", "envConfig");
  di.service("userService", UserService, "db", "avatarService");
  di.service(
    "friendSynchronizer",
    FriendSynchronizer,
    "userService",
    "facebookService"
  );
  return new DIContainer(di.container);
}

export { makeDIContainer };
export default DIContainer;
