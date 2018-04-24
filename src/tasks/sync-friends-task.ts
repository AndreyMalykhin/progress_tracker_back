import { CommanderStatic } from "commander";
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
  const promises: Array<Promise<void>> = [];
  const batchSize = 4;
  const pageSize = 16;
  let fetchedUserCount = 0;
  let pageOffset = 0;
  const tryRun = makeTryRun(log);

  do {
    const shouldContinue = await tryRun(async () => {
      const users = await diContainer.userFetcher.getUnordered(
        pageOffset,
        pageSize
      );
      fetchedUserCount = users.length;

      for (let i = 0; i < fetchedUserCount; ) {
        for (let j = 0; j < batchSize && i < fetchedUserCount; ++i, ++j) {
          const { id, facebookAccessToken } = users[i];
          const promise = diContainer.syncFriendsCmd(id, facebookAccessToken);
          promises.push(promise);
        }

        try {
          await Promise.all(promises);
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
      }
    });

    if (!shouldContinue) {
      break;
    }

    pageOffset += pageSize;
  } while (fetchedUserCount === pageSize);

  setTimeout(() => run(diContainer), diContainer.envConfig.friendsSyncPeriod);
}

export { registerSyncFriendsTask };
