import { combineResolvers } from "graphql-resolvers";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import isClientId from "utils/is-client-id";
import UUID from "utils/uuid";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  avatarId?: ID | UUID;
}

async function setUserAvatarResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const avatar = args.avatarId
    ? { [isClientId(args.avatarId) ? "clientId" : "id"]: args.avatarId }
    : null;
  const input = {
    avatar,
    id: context.session!.userId
  };
  const user = await context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.editUserCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          avatar: { field: "avatarId" }
        });
      }

      throw e;
    }
  });
  return { user };
}

export default combineResolvers(makeCheckAuthResolver(), setUserAvatarResolver);
