import { CommanderStatic } from "commander";
import { IAggregatable } from "models/aggregatable";
import { ITrackable } from "models/trackable";
import { makeTryRun } from "tasks/try-run";
import DIContainer from "utils/di-container";
import { makeLog } from "utils/log";

const log = makeLog("expire-overdue-trackables");

function registerExpireOverdueTrackablesTask(
  commander: CommanderStatic,
  diContainer: DIContainer
) {
  commander
    .command("expire-trackables")
    .description("Expire overdue trackables")
    .action(() => run(diContainer));
}

async function run(diContainer: DIContainer) {
  log.trace("run");
  const { trackableFetcher, expireTrackableCmd, db, envConfig } = diContainer;
  const tryRun = makeTryRun(log);
  let trackable: (ITrackable & IAggregatable) | undefined;
  let expiredTrackableCount = 0;

  do {
    const shouldContinue = await tryRun(async () => {
      await db.transaction(async transaction => {
        trackable = await trackableFetcher.getNextForExpiration(transaction);

        if (trackable) {
          await expireTrackableCmd(trackable, transaction);
          ++expiredTrackableCount;
        }
      });
    });

    if (!shouldContinue) {
      break;
    }
  } while (trackable);

  log.trace("run", "expiredTrackableCount=%o", expiredTrackableCount);
  setTimeout(() => run(diContainer), envConfig.trackablesExpirationPeriod);
}

export { registerExpireOverdueTrackablesTask };
