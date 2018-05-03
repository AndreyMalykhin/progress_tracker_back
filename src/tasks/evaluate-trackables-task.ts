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
  let evaluatedTrackableCount = 0;

  do {
    const shouldContinue = await tryRun(async () => {
      await db.transaction(async transaction => {
        trackable = await trackableFetcher.getNextForEvaluation(transaction);

        if (trackable) {
          await evaluateTrackableCmd(trackable, transaction);
          ++evaluatedTrackableCount;
        }
      });
    });

    if (!shouldContinue) {
      break;
    }
  } while (trackable);

  log.trace("run", "evaluatedTrackableCount=%o", evaluatedTrackableCount);
  setTimeout(() => run(diContainer), envConfig.trackablesEvaluationPeriod);
}

export { registerEvaluateTrackablesTask };
