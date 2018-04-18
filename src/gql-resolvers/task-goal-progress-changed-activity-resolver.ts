import activityResolver from "gql-resolvers/activity-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";
import { ITaskGoalProgressChangedActivity } from "models/task-goal-progress-changed-activity";
import IGqlContext from "utils/gql-context";

const taskGoalProgressChangedActivityResolver = {
  ...activityResolver,
  ...trackableActivityResolver,
  task
};

function task(
  activity: ITaskGoalProgressChangedActivity,
  args: object,
  context: IGqlContext
) {
  return context.loaderMap.task.load(activity.taskId);
}

export default taskGoalProgressChangedActivityResolver;
