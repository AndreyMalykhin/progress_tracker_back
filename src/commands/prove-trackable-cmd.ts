import { validateStatusIdIsPendingProof } from "commands/trackable-validators";
import updateAggregate from "commands/update-aggregate";
import Knex from "knex";
import { ActivityType } from "models/activity";
import { IAggregatable } from "models/aggregatable";
import { IAggregate } from "models/aggregate";
import { IAsset } from "models/asset";
import { IGoal } from "models/goal";
import { IGoalApprovedActivity } from "models/goal-approved-activity";
import { ITrackable } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import AssetFetcher from "services/asset-fetcher";
import TrackableFetcher from "services/trackable-fetcher";
import { validateId, validateIdAndClientId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import UUID from "utils/uuid";
import { IValidationErrors, setError } from "utils/validation-result";

type IProveTrackableCmd = (
  input: IProveTrackableCmdInput,
  transaction: Knex.Transaction
) => Promise<{
  removedAggregateId?: ID;
  trackable: ITrackable;
}>;

interface IProveTrackableCmdInput {
  id?: ID;
  clientId?: UUID;
  userId: ID;
  asset: { id?: ID; clientId?: UUID };
}

function makeProveTrackableCmd(
  db: Knex,
  trackableFetcher: TrackableFetcher,
  assetFetcher: AssetFetcher
): IProveTrackableCmd {
  return async (input, transaction) => {
    const trackableType = undefined;
    let trackable = await trackableFetcher.getByIdOrClientId(
      input.id,
      input.clientId,
      trackableType,
      input.userId,
      transaction
    );
    const asset = await assetFetcher.getByIdOrClientId(
      input.asset.id,
      input.asset.clientId,
      input.userId
    );
    validateInput(input, trackable, asset);
    const aggregateId = (trackable as IAggregatable).parentId;
    trackable = await updateTrackable(trackable!, asset!.id, db, transaction);
    let removedAggregateId: ID | undefined;

    if (aggregateId) {
      const aggregate = await updateAggregate(
        aggregateId,
        transaction,
        db,
        trackableFetcher
      );

      if (!aggregate) {
        removedAggregateId = aggregateId;
        (trackable as IAggregatable).parentId = null;
      }
    }

    if (!trackable.isPublic) {
      await addActivity(trackable, db, transaction);
    }

    return { removedAggregateId, trackable };
  };
}

function validateInput(
  input: IProveTrackableCmdInput,
  trackable: ITrackable | undefined,
  asset: IAsset | undefined
) {
  const errors: IValidationErrors = {};
  validateIdAndClientId(input, trackable, errors);
  const idField = input.id != null ? "id" : "clientId";

  if (!errors[idField]) {
    setError(
      errors,
      idField,
      validateStatusIdIsPendingProof(trackable && trackable.statusId)
    );
  }

  setError(errors, "asset", validateId(asset && asset.id));
  setError(errors, "userId", validateId(input.userId));
  throwIfNotEmpty(errors);
}

async function updateTrackable(
  trackable: ITrackable,
  assetId: ID,
  db: Knex,
  transaction: Knex.Transaction
): Promise<ITrackable> {
  let statusId = TrackableStatus.Approved;
  let rejectCount: number | undefined;
  let approveCount: number | undefined;

  if (trackable.isPublic) {
    statusId = TrackableStatus.PendingReview;
    rejectCount = 0;
    approveCount = 0;
  }

  const rows = await db(DbTable.Trackables)
    .transacting(transaction)
    .update(
      {
        approveCount,
        proofPhotoId: assetId,
        rejectCount,
        statusChangeDate: new Date(),
        statusId
      } as ITrackable & IGoal,
      "*"
    )
    .where("id", trackable.id);
  return rows[0];
}

async function addActivity(
  trackable: ITrackable,
  db: Knex,
  transaction: Knex.Transaction
) {
  await db(DbTable.Activities)
    .transacting(transaction)
    .insert({
      isPublic: false,
      trackableId: trackable.id,
      typeId: ActivityType.GoalApproved,
      userId: trackable.userId
    } as IGoalApprovedActivity);
}

export { makeProveTrackableCmd, IProveTrackableCmd };
