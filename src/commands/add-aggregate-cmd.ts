import {
  IAddTrackableCmd,
  IAddTrackableCmdInput,
  makeAddTrackableCmd
} from "commands/add-trackable-cmd";
import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { IAggregate, IAggregateChildren } from "models/aggregate";
import { ICounter } from "models/counter";
import { INumericalGoal } from "models/numerical-goal";
import { ITaskGoal } from "models/task-goal";
import { ITrackable, TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import aggregateProgress from "services/aggregate-progress";
import TrackableFetcher from "services/trackable-fetcher";
import validateAggregateChildren from "services/validate-aggregate-children";
import { validateList } from "utils/common-validators";
import DbTable from "utils/db-table";
import IGqlContext from "utils/gql-context";
import ID from "utils/id";
import { makeLoaderMapFactory } from "utils/loader-map";
import { IValidationErrors, setError } from "utils/validation-result";

type IAddAggregateCmd = IAddTrackableCmd<IAggregate, IAddAggregateCmdInput>;

interface IAddAggregateCmdInput extends IAddTrackableCmdInput {
  children: Array<{ id?: ID; clientId?: ID }>;
}

function makeAddAggregateCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IAddAggregateCmd {
  return (input, transaction) => {
    let children: ITrackable[];
    const childIds: ID[] = [];
    const childClientIds: ID[] = [];
    const dontAddActivity = true;
    const cmd = makeAddTrackableCmd<IAddAggregateCmdInput, IAggregate>(
      db,
      async (input2, errors) => {
        for (const child of input2.children) {
          if (child.id) {
            childIds.push(child.id);
          } else if (child.clientId) {
            childClientIds.push(child.clientId);
          }
        }

        children = await trackableFetcher.getByIdsOrClientIds(
          childIds,
          childClientIds,
          input2.userId
        );
        await validateInput(input2, errors, children);
      },
      input2 => inputToTrackable(input2, children as IAggregateChildren),
      (input2, aggregate, transaction2) =>
        updateChildren(
          input2,
          aggregate,
          transaction2,
          db,
          childIds,
          childClientIds
        ),
      dontAddActivity
    );
    return cmd(input, transaction);
  };
}

async function updateChildren(
  input: IAddAggregateCmdInput,
  aggregate: IAggregate,
  transaction: Knex.Transaction,
  db: Knex,
  childIds: ID[],
  childClientIds: ID[]
) {
  await db(DbTable.Trackables)
    .transacting(transaction)
    .update("parentId", aggregate.id)
    .where(query => {
      query.whereIn("id", childIds);

      if (childClientIds.length) {
        query.orWhereIn("clientId", childClientIds);
      }
    })
    .andWhere("userId", input.userId);
}

async function inputToTrackable(
  input: IAddAggregateCmdInput,
  children: IAggregateChildren
): Promise<Partial<IAggregate>> {
  const { current: progress, max: maxProgress } = aggregateProgress(
    children as IAggregateChildren
  );
  let isPublic = false;

  for (const child of children) {
    if (child.isPublic) {
      isPublic = true;
      break;
    }
  }

  const { clientId, userId, title } = input;
  return {
    clientId,
    isPublic,
    maxProgress,
    order: Date.now(),
    progress,
    statusId: TrackableStatus.Active,
    title,
    typeId: TrackableType.Aggregate,
    userId
  };
}

async function validateInput(
  input: IAddAggregateCmdInput,
  errors: IValidationErrors,
  childrenToAdd: Array<ITrackable & IAggregatable>
) {
  const oldChildren: IAggregateChildren = [];
  setError(
    errors,
    "children",
    validateAggregateChildren(childrenToAdd, oldChildren)
  );
}

export { makeAddAggregateCmd, IAddAggregateCmdInput, IAddAggregateCmd };
