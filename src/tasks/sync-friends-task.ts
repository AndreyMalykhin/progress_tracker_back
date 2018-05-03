import { CommanderStatic } from "commander";
import { IUser } from "models/user";
import {
  FacebookError,
  isAuthError,
  isPermissionError
} from "services/facebook";
import { makeTryRun } from "tasks/try-run";
import DIContainer from "utils/di-container";
import { makeLog } from "utils/log";

const log = makeLog("sync-friends-task");

function registerSyncFriendsTask(
  commander: CommanderStatic,
  diContainer: DIContainer
) {
  commander
    .command("sync-friends")
    .description("Synchronize Facebook friends")
    .action(() => run(diContainer));
}

async function run(diContainer: DIContainer) {
  log.trace("run");
  const { envConfig, userFetcher, syncFriendsCmd } = diContainer;
  const attemptCount = 1;
  const tryRun = makeTryRun(log, attemptCount);
  let user: IUser | undefined;
  const syncFromDate = new Date(Date.now() - envConfig.friendsSyncPeriod);
  let syncedUserCount = 0;

  do {
    const shouldContinue = await tryRun(async () => {
      user = await userFetcher.getBeforefriendsSyncStartDate(syncFromDate);

      if (!user) {
        return;
      }

      const { id, facebookAccessToken } = user;

      try {
        await syncFriendsCmd(id, facebookAccessToken);
        ++syncedUserCount;
      } catch (e) {
        if (
          e instanceof FacebookError &&
          (isAuthError(e) || isPermissionError(e))
        ) {
          log.error("run", e);
        } else {
          throw e;
        }
      }
    });

    if (!shouldContinue) {
      break;
    }
  } while (user);

  log.trace("run", "syncedUserCount=%o", syncedUserCount);
  setTimeout(() => run(diContainer), envConfig.friendsSyncPeriod);
}

export { registerSyncFriendsTask };
