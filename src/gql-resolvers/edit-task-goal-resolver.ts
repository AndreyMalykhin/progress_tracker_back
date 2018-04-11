import {
  argsToCmdInput,
  IArgs
} from "gql-resolvers/edit-goal-resolver-helpers";
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

async function editTaskGoalResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { editTaskGoalCmd, db } = context.diContainer;
  const input = await argsToCmdInput(args, context);
  const output = await db.transaction(async transaction => {
    try {
      return await editTaskGoalCmd(input, transaction);
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

export default combineResolvers(makeCheckAuthResolver(), editTaskGoalResolver);
