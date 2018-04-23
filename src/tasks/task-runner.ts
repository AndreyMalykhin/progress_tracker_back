import commander from "commander";
import { registerSyncFriendsTask } from "tasks/sync-friends-task";
import { makeDIContainer } from "utils/di-container";

commander.version("1.0.0", "-v, --version");
const diContainer = makeDIContainer();
registerSyncFriendsTask(commander, diContainer);
commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
