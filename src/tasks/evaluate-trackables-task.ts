import { CommanderStatic } from "commander";
import { IGoal } from "models/goal";
import { ITrackable } from "models/trackable";
import DIContainer from "utils/di-container";
import { makeLog } from "utils/log";

const log = makeLog("evaluate-trackables-task");

function registerEvaluateTrackablesTask(
  commander: CommanderStatic,
  diContainer: DIContainer
) {
  commander
    .command("evaluate-trackables")
    .description("Evaluate pending review trackables")
    .action(() => run(diContainer));
}

async function run(diContainer: DIContainer) {
  const { evaluateTrackableCmd, trackableFetcher, db, envConfig } = diContainer;
  let trackable: (ITrackable & IGoal) | undefined;
  let consecutiveErrorCount = 0;

  do {
    try {
      await db.transaction(async transaction => {
        trackable = await trackableFetcher.getNextForEvaluation(transaction);

        if (trackable) {
          return await evaluateTrackableCmd(trackable, transaction);
        }
      });
      consecutiveErrorCount = 0;
    } catch (e) {
      log.error("run", e);
      ++consecutiveErrorCount;

      if (consecutiveErrorCount >= 8) {
        log.error("run", "Too many consecutive errors");
        break;
      }
    }
  } while (trackable);

  setTimeout(() => run(diContainer), envConfig.trackablesEvaluationPeriod);
}

export { registerEvaluateTrackablesTask };
