import { CommanderStatic } from "commander";
import { IGoal } from "models/goal";
import { ITrackable } from "models/trackable";
import { makeTryRun } from "tasks/try-run";
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
  log.trace("run");
  const { evaluateTrackableCmd, trackableFetcher, db, envConfig } = diContainer;
  let trackable: (ITrackable & IGoal) | undefined;
  const tryRun = makeTryRun(log);

  do {
    const shouldContinue = await tryRun(async () => {
      await db.transaction(async transaction => {
        trackable = await trackableFetcher.getNextForEvaluation(transaction);

        if (trackable) {
          return await evaluateTrackableCmd(trackable, transaction);
        }
      });
    });

    if (!shouldContinue) {
      break;
    }
  } while (trackable);

  setTimeout(() => run(diContainer), envConfig.trackablesEvaluationPeriod);
}

export { registerEvaluateTrackablesTask };
