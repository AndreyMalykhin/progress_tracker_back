import { combineResolvers } from "graphql-resolvers";
import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import nonexistentId from "utils/nonexistent-id";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  goal: {
    id: ID;
    title?: string;
    deadlineDate?: number | null;
    difficulty?: Difficulty;
    iconName?: string;
    progressDisplayMode?: ProgressDisplayMode;
  };
}

async function editNumericalGoalResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { iconFetcher, editNumericalGoalCmd, db } = context.diContainer;
  const { goal } = args;
  let iconId: ID | undefined;

  if (goal.iconName) {
    const icon = await iconFetcher.getByName(goal.iconName);
    iconId = icon ? icon.id : nonexistentId;
  }

  const deadlineDate = goal.deadlineDate
    ? new Date(goal.deadlineDate)
    : (goal.deadlineDate as null | undefined);
  const input = {
    deadlineDate,
    difficulty: goal.difficulty,
    iconId,
    [isClientId(goal.id) ? "clientId" : "id"]: goal.id,
    progressDisplayModeId: goal.progressDisplayMode,
    title: goal.title,
    userId: context.session!.userId
  };
  const output = await db.transaction(async transaction => {
    try {
      return await editNumericalGoalCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          iconId: { field: "iconName" },
          progressDisplayModeId: { field: "progressDisplayMode" }
        });
      }

      throw e;
    }
  });
  return { trackable: output };
}

export default combineResolvers(
  makeCheckAuthResolver(),
  editNumericalGoalResolver
);
