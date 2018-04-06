import Bottle from "bottlejs";
import Knex from "knex";
import AccessTokenService from "services/access-token-service";
import ActivityService from "services/activity-service";
import AssetService from "services/asset-service";
import AvatarService from "services/avatar-service";
import FacebookService from "services/facebook-service";
import FriendSynchronizer from "services/friend-synchronizer";
import IconService from "services/icon-service";
import TrackableService from "services/trackable-service";
import UserService from "services/user-service";
import { IEnvConfig, makeEnvConfig } from "utils/env-config";
import { IFetcher, makeFetcher } from "utils/fetcher";
import { ILoaderMapFactory, makeLoaderMapFactory } from "utils/loader-map";
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

  public get activityService(): ActivityService {
    return this.impl.activityService;
  }

  public get trackableService(): TrackableService {
    return this.impl.trackableService;
  }

  public get iconService(): IconService {
    return this.impl.iconService;
  }

  public get assetService(): AssetService {
    return this.impl.assetService;
  }

  public get accessTokenService(): AccessTokenService {
    return this.impl.accessTokenService;
  }

  public get friendSynchronizer(): FriendSynchronizer {
    return this.impl.friendSynchronizer;
  }

  public get fetcher(): IFetcher {
    return this.impl.fetcher;
  }

  public get loaderMapFactory(): ILoaderMapFactory {
    return this.impl.loaderMapFactory;
  }
}

function makeDIContainer() {
  const di = new Bottle();
  di.factory("envConfig", makeEnvConfig);
  di.serviceFactory("db", makeDb, "envConfig");
  di.serviceFactory(
    "loaderMapFactory",
    makeLoaderMapFactory,
    "avatarService",
    "userService",
    "iconService",
    "trackableService",
    "assetService"
  );
  di.service("fetcher", makeFetcher);
  di.service("avatarService", AvatarService, "db");
  di.service("assetService", AssetService, "db");
  di.service("activityService", ActivityService, "db");
  di.service("accessTokenService", AccessTokenService, "envConfig");
  di.service("facebookService", FacebookService, "fetcher", "envConfig");
  di.service("userService", UserService, "db");
  di.service("trackableService", TrackableService, "db", "activityService");
  di.service("iconService", IconService, "db");
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
