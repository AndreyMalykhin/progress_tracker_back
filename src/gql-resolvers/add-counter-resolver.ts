import { IAddCounterCmdInput } from "commands/add-counter-cmd";
import { makeAddTrackableResolver } from "gql-resolvers/add-trackable-resolver";
import Knex from "knex";
import IGqlContext from "utils/gql-context";
import ID from "utils/id";
import { IValidationResult, mapErrors } from "utils/validation-result";

interface IArgs {
  counter: {
    id?: ID;
    title: string;
    iconName: string;
    isPublic: boolean;
  };
}

const addCounterResolver = makeAddTrackableResolver(
  argsToInput,
  addCounter,
  mapValidationErrors
);

function addCounter(
  input: IAddCounterCmdInput,
  transaction: Knex.Transaction,
  context: IGqlContext
) {
  return context.diContainer.addCounterCmd(input, transaction);
}

function mapValidationErrors(validationResult: IValidationResult) {
  mapErrors(validationResult, {
    clientId: { field: "id" },
    iconId: { field: "iconName" }
  });
}

async function argsToInput(args: IArgs, context: IGqlContext) {
  const { counter } = args;
  const icon = await context.diContainer.iconFetcher.getByName(
    counter.iconName
  );
  return {
    clientId: counter.id,
    iconId: icon ? icon.id : "",
    isPublic: counter.isPublic,
    title: counter.title,
    userId: context.session!.userId
  };
}

export default addCounterResolver;
