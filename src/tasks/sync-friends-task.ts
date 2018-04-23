import { CommanderStatic } from "commander";
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
  const pageSize = 32;
  let fetchedUserCount = 0;
  let consecutiveErrorCount = 0;
  let pageOffset = 0;

  do {
    try {
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

        await Promise.all(promises);
      }

      consecutiveErrorCount = 0;
    } catch (e) {
      log.error("run", e);
      ++consecutiveErrorCount;

      if (consecutiveErrorCount >= 8) {
        log.error("run", "Too many consecutive errors");
        break;
      }
    }

    pageOffset += pageSize;
  } while (fetchedUserCount === pageSize);

  setTimeout(() => run(diContainer), diContainer.envConfig.friendsSyncPeriod);
}

export { registerSyncFriendsTask };
