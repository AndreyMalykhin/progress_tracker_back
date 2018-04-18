import Knex from "knex";
import { ITrackable } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import TrackableFetcher from "services/trackable-fetcher";
import { validateId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import isIdEqual from "utils/is-id-equal";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

type IReorderTrackableCmd = (
  input: IReorderTrackableCmdInput,
  transaction: Knex.Transaction
) => Promise<ITrackable>;

interface IReorderTrackableCmdInput {
  source: { id?: ID; clientId?: UUID };
  destination: { id?: ID; clientId?: UUID };
  userId: ID;
}

function makeReorderTrackableCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher
): IReorderTrackableCmd {
  return async (input, transaction) => {
    const trackableType = undefined;
    const srcTrackable = await trackableFetcher.getByIdOrClientId(
      input.source.id,
      input.source.clientId,
      trackableType,
      input.userId,
      transaction
    );
    const destTrackable = await trackableFetcher.getByIdOrClientId(
      input.destination.id,
      input.destination.clientId,
      trackableType,
      input.userId,
      transaction
    );
    validateInput(input, srcTrackable, destTrackable);

    if (isIdEqual(srcTrackable!.id, destTrackable!.id)) {
      return srcTrackable;
    }

    let nextToDestTrackableOrder;
    const isMovingFromTop = srcTrackable!.order > destTrackable!.order;

    if (isMovingFromTop) {
      const nextToDestTrackable = await trackableFetcher.getActiveBeforeOrder(
        destTrackable!.order,
        input.userId,
        transaction
      );
      nextToDestTrackableOrder = nextToDestTrackable
        ? nextToDestTrackable.order
        : destTrackable!.order - 1;
    } else {
      const nextToDestTrackable = await trackableFetcher.getActiveAfterOrder(
        destTrackable!.order,
        input.userId,
        transaction
      );
      nextToDestTrackableOrder = nextToDestTrackable
        ? nextToDestTrackable.order
        : destTrackable!.order + 1;
    }

    const rows = await db(DbTable.Trackables)
      .transacting(transaction)
      .update(
        "order",
        (destTrackable!.order + nextToDestTrackableOrder) / 2,
        "*"
      )
      .where("id", srcTrackable!.id);
    return rows[0];
  };
}

function validateInput(
  input: IReorderTrackableCmdInput,
  srcTrackable: ITrackable | undefined,
  destTrackable: ITrackable | undefined
) {
  const errors: IValidationErrors = {};
  let sourceError = validateId(srcTrackable && srcTrackable.id);

  if (
    srcTrackable &&
    srcTrackable.statusId !== TrackableStatus.Active &&
    srcTrackable.statusId !== TrackableStatus.PendingProof
  ) {
    sourceError = sourceError || "Should be active";
  }

  setError(errors, "source", sourceError);
  let destinationError = validateId(destTrackable && destTrackable.id);

  if (
    destTrackable &&
    destTrackable.statusId !== TrackableStatus.Active &&
    destTrackable.statusId !== TrackableStatus.PendingProof
  ) {
    destinationError = destinationError || "Should be active";
  }
  setError(errors, "destination", destinationError);
  setError(errors, "userId", validateId(input.userId));
  throwIfNotEmpty(errors);
}

export { makeReorderTrackableCmd, IReorderTrackableCmd };
