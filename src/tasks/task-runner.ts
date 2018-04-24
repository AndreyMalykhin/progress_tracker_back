import commander from "commander";
import { registerEvaluateTrackablesTask } from "tasks/evaluate-trackables-task";
import { registerSyncFriendsTask } from "tasks/sync-friends-task";
import { makeDIContainer } from "utils/di-container";

commander.version("1.0.0", "-v, --version");
const diContainer = makeDIContainer();
registerSyncFriendsTask(commander, diContainer);
registerEvaluateTrackablesTask(commander, diContainer);
// registerExpireOverdueTrackablesTask(commander, diContainer);
commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
