import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import nonexistentId from "utils/nonexistent-id";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  gymExercise: {
    id: ID;
    title?: string;
    iconName?: string;
  };
}

async function editGymExerciseResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const { gymExercise } = args;
  let iconId: ID | undefined;

  if (gymExercise.iconName) {
    const icon = await context.diContainer.iconFetcher.getByName(
      gymExercise.iconName
    );
    iconId = icon ? icon.id : nonexistentId;
  }

  const input = {
    iconId,
    title: gymExercise.title,
    [isClientId(gymExercise.id) ? "clientId" : "id"]: gymExercise.id,
    userId: context.session!.userId
  };
  const trackable = await context.diContainer.db.transaction(
    async transaction => {
      try {
        return await context.diContainer.editGymExerciseCmd(input, transaction);
      } catch (e) {
        if (e instanceof ConstraintViolationError) {
          mapErrors(e.validationResult, {
            clientId: { field: "id" },
            iconId: { field: "iconName" }
          });
        }

        throw e;
      }
    }
  );
  return { trackable };
}

export default combineResolvers(
  makeCheckAuthResolver(),
  editGymExerciseResolver
);
