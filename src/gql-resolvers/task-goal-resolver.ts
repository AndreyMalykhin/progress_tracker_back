import aggregatableResolver from "gql-resolvers/aggregatable-resolver";
import goalResolver from "gql-resolvers/goal-resolver";
import primitiveTrackableResolver from "gql-resolvers/primitive-trackable-resolver";
import trackableResolver from "gql-resolvers/trackable-resolver";
import { ITaskGoal } from "models/task-goal";
import IGraphqlContext from "utils/graphql-context";

const taskGoalResolver = {
  ...trackableResolver,
  ...primitiveTrackableResolver,
  ...aggregatableResolver,
  ...goalResolver,
  tasks
};

function tasks(trackable: ITaskGoal, args: object, context: IGraphqlContext) {
  return context.diContainer.trackableService.getTrackableTasks(trackable.id);
}

export default taskGoalResolver;
