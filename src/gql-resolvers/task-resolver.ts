import { ITask } from "models/task";
import IGqlContext from "utils/gql-context";

const taskResolver = {
  goal
};

function goal(task: ITask, args: object, context: IGqlContext) {
  return context.loaderMap.trackable.load(task.goalId);
}

export default taskResolver;
