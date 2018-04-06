import { combineResolvers } from "graphql-resolvers";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import ConstraintViolationError from "utils/constraint-violation-error";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import IGraphqlContext from "utils/graphql-context";
import ID from "utils/id";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  goal: {
    id?: ID;
    title: string;
    deadlineDate?: number;
    difficulty: Difficulty;
    iconName: string;
    isPublic: boolean;
    progressDisplayMode: ProgressDisplayMode;
    tasks: Array<{
      id?: ID;
      title: string;
    }>;
  };
}

async function addTaskGoalResolver(
  parentResult: any,
  args: IArgs,
  context: IGraphqlContext
) {
  const { db, trackableService, iconService } = context.diContainer;
  const input = args.goal;
  const icon = await iconService.getByName(input.iconName);
  const goal = {
    clientId: input.id,
    deadlineDate: input.deadlineDate,
    difficulty: input.difficulty,
    iconId: icon ? icon.id : "",
    isPublic: input.isPublic,
    progressDisplayModeId: input.progressDisplayMode,
    tasks: input.tasks.map(task => {
      return { clientId: task.id, title: task.title };
    }),
    title: input.title,
    userId: context.session!.userId
  };
  let output;
  await db.transaction(async transaction => {
    try {
      output = await trackableService.addTaskGoal(goal, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          clientId: { field: "id" },
          difficulty: { error: "Invalid value" },
          iconId: { field: "iconName" },
          progressDisplayModeId: { field: "progressDisplayMode" }
        });
      }

      throw e;
    }
  });
  return {
    trackable: output
  };
}

export default combineResolvers(makeCheckAuthResolver(), addTaskGoalResolver);
