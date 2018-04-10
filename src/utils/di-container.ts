import Bottle from "bottlejs";
import {
  IAddAggregateCmd,
  makeAddAggregateCmd
} from "commands/add-aggregate-cmd";
import { IAddAvatarCmd, makeAddAvatarCmd } from "commands/add-avatar-cmd";
import { IAddCounterCmd, makeAddCounterCmd } from "commands/add-counter-cmd";
import {
  IAddGymExerciseCmd,
  makeAddGymExerciseCmd
} from "commands/add-gym-exercise-cmd";
import {
  IAddNumericalGoalCmd,
  makeAddNumericalGoalCmd
} from "commands/add-numerical-goal-cmd";
import {
  IAddTaskGoalCmd,
  makeAddTaskGoalCmd
} from "commands/add-task-goal-cmd";
import {
  IAddToAggregateCmd,
  makeAddToAggregateCmd
} from "commands/add-to-aggregate-cmd";
import { ILoginCmd, makeLoginCmd } from "commands/login-cmd";
import { ISyncFriendsCmd, makeSyncFriendsCmd } from "commands/sync-friends-cmd";
import Knex from "knex";
import AccessTokenIssuer from "services/access-token-issuer";
import AssetFetcher from "services/asset-fetcher";
import AvatarFetcher from "services/avatar-fetcher";
import Facebook from "services/facebook";
import GymExerciseEntryFetcher from "services/gym-exercise-entry-fetcher";
import IconFetcher from "services/icon-fetcher";
import MuteFetcher from "services/mute-fetcher";
import ReviewFetcher from "services/review-fetcher";
import TaskFetcher from "services/task-fetcher";
import TrackableFetcher from "services/trackable-fetcher";
import UserFetcher from "services/user-fetcher";
import UserReportFetcher from "services/user-report-fetcher";
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

  public get facebook(): Facebook {
    return this.impl.facebook;
  }

  public get userFetcher(): UserFetcher {
    return this.impl.userFetcher;
  }

  public get userReportFetcher(): UserReportFetcher {
    return this.impl.userReportFetcher;
  }

  public get muteFetcher(): MuteFetcher {
    return this.impl.muteFetcher;
  }

  public get avatarFetcher(): AvatarFetcher {
    return this.impl.avatarFetcher;
  }

  public get reviewFetcher(): ReviewFetcher {
    return this.impl.reviewFetcher;
  }

  public get trackableFetcher(): TrackableFetcher {
    return this.impl.trackableFetcher;
  }

  public get iconFetcher(): IconFetcher {
    return this.impl.iconFetcher;
  }

  public get taskFetcher(): TaskFetcher {
    return this.impl.taskFetcher;
  }

  public get gymExerciseEntryFetcher(): GymExerciseEntryFetcher {
    return this.impl.gymExerciseEntryFetcher;
  }

  public get assetFetcher(): AssetFetcher {
    return this.impl.assetFetcher;
  }

  public get accessTokenIssuer(): AccessTokenIssuer {
    return this.impl.accessTokenIssuer;
  }

  public get fetcher(): IFetcher {
    return this.impl.fetcher;
  }

  public get loaderMapFactory(): ILoaderMapFactory {
    return this.impl.loaderMapFactory;
  }

  public get loginCmd(): ILoginCmd {
    return this.impl.loginCmd;
  }

  public get syncFriendsCmd(): ISyncFriendsCmd {
    return this.impl.syncFriendsCmd;
  }

  public get addAvatarCmd(): IAddAvatarCmd {
    return this.impl.addAvatarCmd;
  }

  public get addTaskGoalCmd(): IAddTaskGoalCmd {
    return this.impl.addTaskGoalCmd;
  }

  public get addNumericalGoalCmd(): IAddNumericalGoalCmd {
    return this.impl.addNumericalGoalCmd;
  }

  public get addCounterCmd(): IAddCounterCmd {
    return this.impl.addCounterCmd;
  }

  public get addGymExerciseCmd(): IAddGymExerciseCmd {
    return this.impl.addGymExerciseCmd;
  }

  public get addAggregateCmd(): IAddAggregateCmd {
    return this.impl.addAggregateCmd;
  }

  public get addToAggregateCmd(): IAddToAggregateCmd {
    return this.impl.addToAggregateCmd;
  }
}

function makeDIContainer() {
  const di = new Bottle();
  di.factory("envConfig", makeEnvConfig);
  di.serviceFactory("db", makeDb, "envConfig");
  di.serviceFactory(
    "loaderMapFactory",
    makeLoaderMapFactory,
    "avatarFetcher",
    "userFetcher",
    "iconFetcher",
    "trackableFetcher",
    "assetFetcher"
  );
  di.serviceFactory(
    "loginCmd",
    makeLoginCmd,
    "facebook",
    "userFetcher",
    "accessTokenIssuer",
    "db",
    "syncFriendsCmd",
    "addAvatarCmd"
  );
  di.serviceFactory(
    "syncFriendsCmd",
    makeSyncFriendsCmd,
    "userFetcher",
    "facebook",
    "db"
  );
  di.serviceFactory("addAvatarCmd", makeAddAvatarCmd, "db");
  di.serviceFactory("addTaskGoalCmd", makeAddTaskGoalCmd, "db");
  di.serviceFactory("addNumericalGoalCmd", makeAddNumericalGoalCmd, "db");
  di.serviceFactory("addCounterCmd", makeAddCounterCmd, "db");
  di.serviceFactory("addGymExerciseCmd", makeAddGymExerciseCmd, "db");
  di.serviceFactory(
    "addAggregateCmd",
    makeAddAggregateCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "addToAggregateCmd",
    makeAddToAggregateCmd,
    "db",
    "trackableFetcher"
  );
  di.service("fetcher", makeFetcher);
  di.service("avatarFetcher", AvatarFetcher, "db");
  di.service("reviewFetcher", ReviewFetcher, "db");
  di.service("assetFetcher", AssetFetcher, "db");
  di.service("taskFetcher", TaskFetcher, "db");
  di.service("gymExerciseEntryFetcher", GymExerciseEntryFetcher, "db");
  di.service("accessTokenIssuer", AccessTokenIssuer, "envConfig");
  di.service("facebook", Facebook, "fetcher", "envConfig");
  di.service("userFetcher", UserFetcher, "db");
  di.service("muteFetcher", MuteFetcher, "db");
  di.service("userReportFetcher", UserReportFetcher, "db");
  di.service("trackableFetcher", TrackableFetcher, "db");
  di.service("iconFetcher", IconFetcher, "db");
  return new DIContainer(di.container);
}

export { makeDIContainer };
export default DIContainer;
