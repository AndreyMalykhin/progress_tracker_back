import Difficulty from "models/difficulty";
import ProgressDisplayMode from "models/progress-display-mode";
import IGqlContext from "utils/gql-context";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import nonexistentId from "utils/nonexistent-id";

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

async function argsToCmdInput(args: IArgs, context: IGqlContext) {
  const { goal } = args;
  let iconId: ID | undefined;

  if (goal.iconName) {
    const icon = await context.diContainer.iconFetcher.getByName(goal.iconName);
    iconId = icon ? icon.id : nonexistentId;
  }

  const deadlineDate = goal.deadlineDate
    ? new Date(goal.deadlineDate)
    : (goal.deadlineDate as null | undefined);
  return {
    deadlineDate,
    difficulty: goal.difficulty,
    iconId,
    [isClientId(goal.id) ? "clientId" : "id"]: goal.id,
    progressDisplayModeId: goal.progressDisplayMode,
    title: goal.title,
    userId: context.session!.userId
  };
}

export { argsToCmdInput, IArgs };
