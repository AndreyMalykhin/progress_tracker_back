import { combineResolvers } from "graphql-resolvers";
import ReportReason from "models/report-reason";
import ConstraintViolationError from "utils/constraint-violation-error";
import IGqlContext from "utils/gql-context";
import { makeCheckAuthResolver } from "utils/gql-resolver-utils";
import ID from "utils/id";
import { mapErrors } from "utils/validation-result";

interface IArgs {
  id: ID;
  reason: ReportReason;
}

async function reportUserResolver(
  parentValue: any,
  args: IArgs,
  context: IGqlContext
) {
  const input = {
    reasonId: args.reason,
    reportedId: args.id,
    reporterId: context.session!.userId
  };
  const user = await context.diContainer.db.transaction(async transaction => {
    try {
      return await context.diContainer.reportUserCmd(input, transaction);
    } catch (e) {
      if (e instanceof ConstraintViolationError) {
        mapErrors(e.validationResult, {
          reasonId: { field: "reason" },
          reportedId: { field: "id" }
        });
      }

      throw e;
    }
  });
  return { user };
}

export default combineResolvers(makeCheckAuthResolver(), reportUserResolver);
