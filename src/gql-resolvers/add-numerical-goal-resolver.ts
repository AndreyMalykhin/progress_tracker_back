import { IAddNumericalGoalCmdInput } from "commands/add-numerical-goal-cmd";
import { makeAddTrackableResolver } from "gql-resolvers/add-trackable-resolver";
import { combineResolvers } from "graphql-resolvers";
import Knex from "knex";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import nonexistentId from "utils/nonexistent-id";
import UUID from "utils/uuid";
import { IValidationResult, mapErrors } from "utils/validation-result";

interface IArgs {
  goal: {
    id?: UUID;
    title: string;
    deadlineDate?: number;
    difficulty: Difficulty;
    iconName: string;
    isPublic: boolean;
    progressDisplayMode: ProgressDisplayMode;
    maxProgress: number;
  };
}

const addNumericalGoalResolver = makeAddTrackableResolver(
  argsToInput,
  addNumericalGoal,
  mapValidationErrors
);

function addNumericalGoal(
  input: IAddNumericalGoalCmdInput,
  transaction: Knex.Transaction,
  context: IGqlContext
) {
  return context.diContainer.addNumericalGoalCmd(input, transaction);
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
    iconId: icon ? icon.id : nonexistentId,
    isPublic: goal.isPublic,
    maxProgress: goal.maxProgress,
    progressDisplayModeId: goal.progressDisplayMode,
    title: goal.title,
    userId: context.session!.userId
  };
}

export default addNumericalGoalResolver;
