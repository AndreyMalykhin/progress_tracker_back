import { Unauthorized } from "http-errors";
import IGqlContext from "utils/gql-context";

type IParentValue<T> = T & {
  [field: string]: Date;
};

function makeRedirectResolver<T>(toField: keyof T) {
  return (parentValue: T) => {
    return parentValue[toField];
  };
}

function makeCheckAuthResolver<TParentValue, TArgs>(
  condition?: (
    parentValue: TParentValue,
    args: TArgs,
    context: IGqlContext
  ) => boolean
) {
  return (parentValue: TParentValue, args: TArgs, context: IGqlContext) => {
    if (
      !context.session &&
      (!condition || condition(parentValue, args, context))
    ) {
      throw new Unauthorized();
    }
  };
}

export { makeRedirectResolver, makeCheckAuthResolver };
