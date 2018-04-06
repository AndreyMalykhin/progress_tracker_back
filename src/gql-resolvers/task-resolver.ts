import { ITask } from "models/task";
import IGraphqlContext from "utils/graphql-context";

const taskResolver = {
  goal
};

function goal(task: ITask, args: object, context: IGraphqlContext) {
  return context.loaderMap.trackable.load(task.goalId);
}

export default taskResolver;
