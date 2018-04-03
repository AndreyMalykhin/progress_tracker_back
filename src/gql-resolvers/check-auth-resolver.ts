import { Unauthorized } from "http-errors";
import IGraphqlContext from "utils/graphql-context";

function checkAuthResolver(
  parentValue: any,
  args: any,
  context: IGraphqlContext
) {
  if (!context.session) {
    throw new Unauthorized();
  }
}

export default checkAuthResolver;
