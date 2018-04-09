import { IAddAggregateCmdInput } from "commands/add-aggregate-cmd";
import { makeAddTrackableResolver } from "gql-resolvers/add-trackable-resolver";
import Knex from "knex";
import IGqlContext from "utils/gql-context";
import ID from "utils/id";
import { IValidationResult, mapErrors } from "utils/validation-result";
import { isUUID } from "validator";

interface IArgs {
  aggregate: {
    id: ID;
    title: string;
    children: Array<{ id: ID }>;
  };
}

const addAggregateResolver = makeAddTrackableResolver(
  argsToInput,
  addAggregate,
  mapValidationErrors
);

function addAggregate(
  input: IAddAggregateCmdInput,
  transaction: Knex.Transaction,
  context: IGqlContext
) {
  return context.diContainer.addAggregateCmd(input, transaction);
}

function mapValidationErrors(validationResult: IValidationResult) {
  mapErrors(validationResult, {
    clientId: { field: "id" }
  });
}

async function argsToInput(args: IArgs, context: IGqlContext) {
  const { aggregate } = args;
  const children = [];

  for (const child of aggregate.children) {
    if (isUUID(child.id)) {
      children.push({ clientId: child.id });
    } else {
      children.push({ id: child.id });
    }
  }

  return {
    children,
    clientId: aggregate.id,
    title: aggregate.title,
    userId: context.session!.userId
  };
}

export default addAggregateResolver;
