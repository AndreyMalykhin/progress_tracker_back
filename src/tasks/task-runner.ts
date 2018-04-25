import commander from "commander";
import { registerEvaluateTrackablesTask } from "tasks/evaluate-trackables-task";
import { registerExpireOverdueTrackablesTask } from "tasks/expire-overdue-trackables-task";
import { registerSyncFriendsTask } from "tasks/sync-friends-task";
import { makeDIContainer } from "utils/di-container";
import { registerErrorReporter } from "utils/error-reporter";

const diContainer = makeDIContainer();
registerErrorReporter(diContainer.envConfig);
commander.version(diContainer.envConfig.version, "-v, --version");
registerSyncFriendsTask(commander, diContainer);
registerEvaluateTrackablesTask(commander, diContainer);
registerExpireOverdueTrackablesTask(commander, diContainer);
commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
