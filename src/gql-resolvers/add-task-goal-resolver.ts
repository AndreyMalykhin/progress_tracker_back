import { IAddTaskGoalCmdInput } from "commands/add-task-goal-cmd";
import { makeAddTrackableResolver } from "gql-resolvers/add-trackable-resolver";
import { combineResolvers } from "graphql-resolvers";
import Knex from "knex";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import { IValidationResult, mapErrors } from "utils/validation-result";

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

const addTaskGoalResolver = makeAddTrackableResolver(
  argsToInput,
  addTaskGoal,
  mapValidationErrors
);

function addTaskGoal(
  input: IAddTaskGoalCmdInput,
  transaction: Knex.Transaction,
  context: IGqlContext
) {
  return context.diContainer.addTaskGoalCmd(input, transaction);
}

function mapValidationErrors(validationResult: IValidationResult) {
  mapErrors(validationResult, {
    clientId: { field: "id" },
    iconId: { field: "iconName" },
    progressDisplayModeId: { field: "progressDisplayMode" }
  });
}

async function argsToInput(args: IArgs, context: IGqlContext) {
  const { goal } = args;
  const icon = await context.diContainer.iconFetcher.getByName(goal.iconName);
  return {
    clientId: goal.id,
    deadlineDate: goal.deadlineDate,
    difficulty: goal.difficulty,
    iconId: icon ? icon.id : "",
    isPublic: goal.isPublic,
    progressDisplayModeId: goal.progressDisplayMode,
    tasks: goal.tasks.map(task => {
      return { clientId: task.id, title: task.title };
    }),
    title: goal.title,
    userId: context.session!.userId
  };
}

export default addTaskGoalResolver;
