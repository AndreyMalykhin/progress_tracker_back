import IGraphqlContext from "utils/graphql-context";

interface IArgs {
  id?: string;
  title: string;
  deadlineDate: number;
  difficulty: number;
  iconName: string;
  isPublic: boolean;
  progressDisplayMode: string;
  tasks: Array<{
    id?: string;
    title: string;
  }>;
}

function addTaskGoalResolver(
  parentResult: any,
  args: IArgs,
  context: IGraphqlContext
) {
  // TODO
}

export default addTaskGoalResolver;
