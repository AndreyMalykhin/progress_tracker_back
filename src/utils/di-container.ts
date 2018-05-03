import Bottle from "bottlejs";
import {
  IAddAggregateCmd,
  makeAddAggregateCmd
} from "commands/add-aggregate-cmd";
import { IAddCounterCmd, makeAddCounterCmd } from "commands/add-counter-cmd";
import {
  IAddCounterProgressCmd,
  makeAddCounterProgressCmd
} from "commands/add-counter-progress-cmd";
import {
  IAddGymExerciseCmd,
  makeAddGymExerciseCmd
} from "commands/add-gym-exercise-cmd";
import {
  IAddGymExerciseEntryCmd,
  makeAddGymExerciseEntryCmd
} from "commands/add-gym-exercise-entry-cmd";
import {
  IAddNumericalGoalCmd,
  makeAddNumericalGoalCmd
} from "commands/add-numerical-goal-cmd";
import {
  IAddNumericalGoalProgressCmd,
  makeAddNumericalGoalProgressCmd
} from "commands/add-numerical-goal-progress-cmd";
import {
  IAddTaskGoalCmd,
  makeAddTaskGoalCmd
} from "commands/add-task-goal-cmd";
import {
  IAddToAggregateCmd,
  makeAddToAggregateCmd
} from "commands/add-to-aggregate-cmd";
import {
  IApproveTrackableCmd,
  makeApproveTrackableCmd
} from "commands/approve-trackable-cmd";
import {
  IBreakAggregateCmd,
  makeBreakAggregateCmd
} from "commands/break-aggregate-cmd";
import {
  IEditAggregateCmd,
  makeEditAggregateCmd
} from "commands/edit-aggregate-cmd";
import { IEditCounterCmd, makeEditCounterCmd } from "commands/edit-counter-cmd";
import {
  IEditGymExerciseCmd,
  makeEditGymExerciseCmd
} from "commands/edit-gym-exercise-cmd";
import {
  IEditNumericalGoalCmd,
  makeEditNumericalGoalCmd
} from "commands/edit-numerical-goal-cmd";
import { IEditTaskCmd, makeEditTaskCmd } from "commands/edit-task-cmd";
import {
  IEditTaskGoalCmd,
  makeEditTaskGoalCmd
} from "commands/edit-task-goal-cmd";
import { IEditUserCmd, makeEditUserCmd } from "commands/edit-user-cmd";
import {
  IEvaluateTrackableCmd,
  makeEvaluateTrackableCmd
} from "commands/evaluate-trackable-cmd";
import {
  IExpireTrackableCmd,
  makeExpireTrackableCmd
} from "commands/expire-trackable-cmd";
import { ILoginCmd, makeLoginCmd } from "commands/login-cmd";
import {
  IProveTrackableCmd,
  makeProveTrackableCmd
} from "commands/prove-trackable-cmd";
import {
  IRejectTrackableCmd,
  makeRejectTrackableCmd
} from "commands/reject-trackable-cmd";
import {
  IRemoveTrackableCmd,
  makeRemoveTrackableCmd
} from "commands/remove-trackable-cmd";
import {
  IReorderTrackableCmd,
  makeReorderTrackableCmd
} from "commands/reorder-trackable-cmd";
import { IReportUserCmd, makeReportUserCmd } from "commands/report-user-cmd";
import {
  IResetRewardableReviewCountCmd,
  makeResetRewardableReviewCountCmd
} from "commands/reset-rewardable-review-count-cmd";
import {
  ISetTaskDoneCmd,
  makeSetTaskDoneCmd
} from "commands/set-task-done-cmd";
import {
  ISetUserMutedCmd,
  makeSetUserMutedCmd
} from "commands/set-user-muted-cmd";
import { ISyncFriendsCmd, makeSyncFriendsCmd } from "commands/sync-friends-cmd";
import {
  IUnaggregateTrackableCmd,
  makeUnaggregateTrackableCmd
} from "commands/unaggregate-trackable-cmd";
import { IUploadAssetCmd, makeUploadAssetCmd } from "commands/upload-asset-cmd";
import {
  IUploadAvatarCmd,
  makeUploadAvatarCmd
} from "commands/upload-avatar-cmd";
import Knex from "knex";
import AccessTokenIssuer from "services/access-token-issuer";
import ActivityFetcher from "services/activity-fetcher";
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
import { IImgProcessor, makeImgProcessor } from "utils/img-processor";
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

  public get breakAggregateCmd(): IBreakAggregateCmd {
    return this.impl.breakAggregateCmd;
  }

  public get unaggregateTrackableCmd(): IUnaggregateTrackableCmd {
    return this.impl.unaggregateTrackableCmd;
  }

  public get addGymExerciseEntryCmd(): IAddGymExerciseEntryCmd {
    return this.impl.addGymExerciseEntryCmd;
  }

  public get editNumericalGoalCmd(): IEditNumericalGoalCmd {
    return this.impl.editNumericalGoalCmd;
  }

  public get editTaskGoalCmd(): IEditTaskGoalCmd {
    return this.impl.editTaskGoalCmd;
  }

  public get editTaskCmd(): IEditTaskCmd {
    return this.impl.editTaskCmd;
  }

  public get editCounterCmd(): IEditCounterCmd {
    return this.impl.editCounterCmd;
  }

  public get editGymExerciseCmd(): IEditGymExerciseCmd {
    return this.impl.editGymExerciseCmd;
  }

  public get editAggregateCmd(): IEditAggregateCmd {
    return this.impl.editAggregateCmd;
  }

  public get addCounterProgressCmd(): IAddCounterProgressCmd {
    return this.impl.addCounterProgressCmd;
  }

  public get addNumericalGoalProgressCmd(): IAddNumericalGoalProgressCmd {
    return this.impl.addNumericalGoalProgressCmd;
  }

  public get setTaskDoneCmd(): ISetTaskDoneCmd {
    return this.impl.setTaskDoneCmd;
  }

  public get removeTrackableCmd(): IRemoveTrackableCmd {
    return this.impl.removeTrackableCmd;
  }

  public get approveTrackableCmd(): IApproveTrackableCmd {
    return this.impl.approveTrackableCmd;
  }

  public get rejectTrackableCmd(): IRejectTrackableCmd {
    return this.impl.rejectTrackableCmd;
  }

  public get editUserCmd(): IEditUserCmd {
    return this.impl.editUserCmd;
  }

  public get setUserMutedCmd(): ISetUserMutedCmd {
    return this.impl.setUserMutedCmd;
  }

  public get reportUserCmd(): IReportUserCmd {
    return this.impl.reportUserCmd;
  }

  public get proveTrackableCmd(): IProveTrackableCmd {
    return this.impl.proveTrackableCmd;
  }

  public get uploadAssetCmd(): IUploadAssetCmd {
    return this.impl.uploadAssetCmd;
  }

  public get uploadAvatarCmd(): IUploadAvatarCmd {
    return this.impl.uploadAvatarCmd;
  }

  public get reorderTrackableCmd(): IReorderTrackableCmd {
    return this.impl.reorderTrackableCmd;
  }

  public get activityFetcher(): ActivityFetcher {
    return this.impl.activityFetcher;
  }

  public get evaluateTrackableCmd(): IEvaluateTrackableCmd {
    return this.impl.evaluateTrackableCmd;
  }

  public get expireTrackableCmd(): IExpireTrackableCmd {
    return this.impl.expireTrackableCmd;
  }

  public get imgProcessor(): IImgProcessor {
    return this.impl.imgProcessor;
  }

  public get resetRewardableReviewCountCmd(): IResetRewardableReviewCountCmd {
    return this.impl.resetRewardableReviewCountCmd;
  }
}

function makeDIContainer() {
  const di = new Bottle();
  di.factory("imgProcessor", makeImgProcessor);
  di.factory("envConfig", makeEnvConfig);
  di.serviceFactory("db", makeDb, "envConfig");
  di.serviceFactory(
    "loaderMapFactory",
    makeLoaderMapFactory,
    "avatarFetcher",
    "userFetcher",
    "iconFetcher",
    "trackableFetcher",
    "assetFetcher",
    "gymExerciseEntryFetcher",
    "taskFetcher"
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
  di.serviceFactory(
    "breakAggregateCmd",
    makeBreakAggregateCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "unaggregateTrackableCmd",
    makeUnaggregateTrackableCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "addGymExerciseEntryCmd",
    makeAddGymExerciseEntryCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "editNumericalGoalCmd",
    makeEditNumericalGoalCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "editTaskGoalCmd",
    makeEditTaskGoalCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "editCounterCmd",
    makeEditCounterCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "editGymExerciseCmd",
    makeEditGymExerciseCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "editAggregateCmd",
    makeEditAggregateCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "addCounterProgressCmd",
    makeAddCounterProgressCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "addNumericalGoalProgressCmd",
    makeAddNumericalGoalProgressCmd,
    "db",
    "trackableFetcher",
    "addGoalProgressCmd"
  );
  di.serviceFactory(
    "setTaskDoneCmd",
    makeSetTaskDoneCmd,
    "db",
    "taskFetcher",
    "trackableFetcher",
    "addGoalProgressCmd"
  );
  di.serviceFactory(
    "removeTrackableCmd",
    makeRemoveTrackableCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "approveTrackableCmd",
    makeApproveTrackableCmd,
    "db",
    "trackableFetcher",
    "userFetcher",
    "reviewFetcher"
  );
  di.serviceFactory(
    "rejectTrackableCmd",
    makeRejectTrackableCmd,
    "db",
    "trackableFetcher",
    "userFetcher",
    "reviewFetcher"
  );
  di.serviceFactory(
    "editUserCmd",
    makeEditUserCmd,
    "db",
    "userFetcher",
    "avatarFetcher"
  );
  di.serviceFactory(
    "setUserMutedCmd",
    makeSetUserMutedCmd,
    "db",
    "muteFetcher",
    "userFetcher"
  );
  di.serviceFactory(
    "reportUserCmd",
    makeReportUserCmd,
    "db",
    "userFetcher",
    "userReportFetcher"
  );
  di.serviceFactory(
    "proveTrackableCmd",
    makeProveTrackableCmd,
    "db",
    "trackableFetcher",
    "assetFetcher"
  );
  di.serviceFactory(
    "uploadAssetCmd",
    makeUploadAssetCmd,
    "db",
    "envConfig",
    "imgProcessor"
  );
  di.serviceFactory(
    "reorderTrackableCmd",
    makeReorderTrackableCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "uploadAvatarCmd",
    makeUploadAvatarCmd,
    "db",
    "envConfig",
    "imgProcessor"
  );
  di.serviceFactory("editTaskCmd", makeEditTaskCmd, "db", "taskFetcher");
  di.serviceFactory(
    "evaluateTrackableCmd",
    makeEvaluateTrackableCmd,
    "reviewFetcher"
  );
  di.serviceFactory(
    "expireTrackableCmd",
    makeExpireTrackableCmd,
    "db",
    "trackableFetcher"
  );
  di.serviceFactory(
    "resetRewardableReviewCountCmd",
    makeResetRewardableReviewCountCmd
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
  di.service("activityFetcher", ActivityFetcher, "db");
  return new DIContainer(di.container);
}

export { makeDIContainer };
export default DIContainer;
