import { CommanderStatic } from "commander";
import { makeTryRun } from "tasks/try-run";
import DIContainer from "utils/di-container";
import { makeLog } from "utils/log";

const log = makeLog("reset-rewardable-review-count");

function registerResetRewardableReviewCountTask(
  commander: CommanderStatic,
  diContainer: DIContainer
) {
  commander
    .command("reset-rewardable-review-count")
    .description("Reset rewardable review count")
    .action(() => run(diContainer));
}

async function run(diContainer: DIContainer) {
  log.trace("run");
  const { envConfig, db, resetRewardableReviewCountCmd } = diContainer;
  const tryRun = makeTryRun(log);
  await tryRun(async () => {
    return await db.transaction(transaction =>
      resetRewardableReviewCountCmd(transaction)
    );
  });
  setTimeout(
    () => run(diContainer),
    envConfig.rewardableReviewCountResetPeriod
  );
}

export { registerResetRewardableReviewCountTask };
