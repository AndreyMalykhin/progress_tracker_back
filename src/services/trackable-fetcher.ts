import Knex from "knex";
import { IAggregatable } from "models/aggregatable";
import { IAggregateChildren } from "models/aggregate";
import Audience from "models/audience";
import Difficulty from "models/difficulty";
import { IGoal } from "models/goal";
import { INumericalGoal } from "models/numerical-goal";
import ProgressDisplayMode from "models/progress-display-mode";
import { IReview } from "models/review";
import { ITask } from "models/task";
import { ITaskGoal } from "models/task-goal";
import { ITrackable, TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import {
  validateClientId,
  validateEnum,
  validateId,
  validateLength,
  validateList,
  validateRange
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import { IDbCursor } from "utils/db-cursor";
import DbTable from "utils/db-table";
import ID from "utils/id";
import isIdEqual from "utils/is-id-equal";
import safeId from "utils/safe-id";
import safeUUID from "utils/safe-uuid";
import UUID from "utils/uuid";
import {
  hasErrors,
  isEmpty,
  IValidationErrors,
  setError
} from "utils/validation-result";

const millisecondsInDay = 86400 * 1000;

class TrackableFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getNextForExpiration(
    transaction: Knex.Transaction
  ): Promise<(ITrackable & IAggregatable) | undefined> {
    return await this.db(DbTable.Trackables)
      .transacting(transaction)
      .forUpdate()
      .where("statusId", TrackableStatus.Active)
      .andWhere("deadlineDate", "<=", new Date())
      .first();
  }

  public async getNextForEvaluation(
    transaction: Knex.Transaction
  ): Promise<(ITrackable & IGoal) | undefined> {
    return await this.db(DbTable.Trackables)
      .transacting(transaction)
      .forUpdate()
      .where("statusId", TrackableStatus.PendingReview)
      .andWhereRaw("?? + ?? >= ?", ["approveCount", "rejectCount", 5])
      .andWhere(
        "statusChangeDate",
        ">",
        new Date(Date.now() - millisecondsInDay)
      )
      .first();
  }

  public async getPendingReview(
    audience: Audience,
    afterCursor?: IDbCursor<Date>,
    viewerId?: ID,
    limit = 8
  ): Promise<Array<ITrackable & IGoal>> {
    const query = this.db(DbTable.Trackables + " as t")
      .select("t.*")
      .where("t.statusId", TrackableStatus.PendingReview)
      .orderByRaw("row(??, ??) asc", ["t.statusChangeDate", "id"])
      .limit(limit);

    switch (audience) {
      case Audience.Friends:
        if (!viewerId) {
          return [];
        }

        query.innerJoin(DbTable.Friendships + " as f", {
          "f.srcId": this.db.raw(safeId(viewerId)),
          "f.targetId": "t.userId"
        });
        break;
      case Audience.Global:
        break;
      case Audience.Me:
        if (!viewerId) {
          return [];
        }

        query.andWhere("t.userId", safeId(viewerId));
        break;
      default:
        return [];
    }

    if (afterCursor) {
      query.andWhereRaw("row(??, ??) > row(?, ?)::timestamp_cursor", [
        "t.statusChangeDate",
        "t.id",
        afterCursor.value,
        afterCursor.id
      ]);
    }

    return await query;
  }

  public async getActiveAfterOrder(
    order: number,
    userId: ID,
    transaction?: Knex.Transaction
  ): Promise<ITrackable | undefined> {
    return await this.db(DbTable.Trackables)
      .transacting(transaction)
      .whereIn("statusId", [
        TrackableStatus.Active,
        TrackableStatus.PendingProof
      ])
      .andWhere("userId", safeId(userId))
      .andWhereRaw("?? is null", "parentId")
      .andWhere("order", ">", order)
      .first();
  }

  public async getActiveBeforeOrder(
    order: number,
    userId: ID,
    transaction?: Knex.Transaction
  ): Promise<ITrackable | undefined> {
    return await this.db(DbTable.Trackables)
      .transacting(transaction)
      .whereIn("statusId", [
        TrackableStatus.Active,
        TrackableStatus.PendingProof
      ])
      .andWhere("userId", safeId(userId))
      .andWhereRaw("?? is null", "parentId")
      .andWhere("order", "<", order)
      .first();
  }

  public async get(
    id: ID,
    typeId?: TrackableType,
    userId?: ID,
    transaction?: Knex.Transaction
  ): Promise<ITrackable | undefined> {
    const query = this.db(DbTable.Trackables)
      .transacting(transaction)
      .where("id", safeId(id))
      .first();

    if (userId) {
      query.andWhere("userId", safeId(userId));
    }

    if (typeId) {
      query.andWhere("typeId", typeId);
    }

    return await query;
  }

  public async getActive(
    ownerId: ID,
    afterOrder?: number,
    viewerId?: ID,
    limit = 8
  ): Promise<ITrackable[]> {
    const query = this.db(DbTable.Trackables)
      .whereIn("statusId", [
        TrackableStatus.Active,
        TrackableStatus.PendingProof
      ])
      .andWhere("userId", safeId(ownerId))
      .andWhereRaw("?? is null", "parentId")
      .orderBy("order", "desc")
      .limit(limit);

    if (afterOrder) {
      query.andWhere("order", "<", afterOrder);
    }

    if (!viewerId || !isIdEqual(viewerId, ownerId)) {
      query.andWhere("isPublic", true);
    }

    return await query;
  }

  public async getArchived(
    ownerId: ID,
    statusId:
      | TrackableStatus.Approved
      | TrackableStatus.Expired
      | TrackableStatus.Rejected,
    afterCursor?: IDbCursor<Date>,
    viewerId?: ID,
    limit = 8
  ): Promise<ITrackable[]> {
    if (
      statusId !== TrackableStatus.Approved &&
      statusId !== TrackableStatus.Rejected &&
      statusId !== TrackableStatus.Expired
    ) {
      return [];
    }

    const query = this.db(DbTable.Trackables)
      .where("statusId", statusId)
      .andWhere("userId", safeId(ownerId))
      .orderByRaw("row(??, ??) desc", ["statusChangeDate", "id"])
      .limit(limit);

    if (afterCursor) {
      query.andWhereRaw("row(??, ??) < row(?, ?)::timestamp_cursor", [
        "statusChangeDate",
        "id",
        afterCursor.value,
        afterCursor.id
      ]);
    }

    if (!viewerId || !isIdEqual(viewerId, ownerId)) {
      query.andWhere("isPublic", true);
    }

    return await query;
  }

  public async getByIds(ids: ID[]): Promise<ITrackable[]> {
    return await this.db(DbTable.Trackables).whereIn("id", ids.map(safeId));
  }

  public async getByIdsOrClientIds(
    ids: ID[],
    clientIds: UUID[],
    typeId?: TrackableType,
    userId?: ID,
    transaction?: Knex.Transaction
  ): Promise<ITrackable[]> {
    if (!ids.length && !clientIds.length) {
      return [];
    }

    const query = this.db(DbTable.Trackables)
      .transacting(transaction)
      .where(q => {
        if (ids.length) {
          q.whereIn("id", ids.map(safeId));
        }

        if (clientIds.length) {
          q.orWhereIn("clientId", clientIds.map(safeUUID));
        }
      });

    if (userId) {
      query.andWhere("userId", safeId(userId));
    }

    if (typeId) {
      query.andWhere("typeId", typeId);
    }

    return await query;
  }

  public async getByIdOrClientId(
    id: ID | undefined,
    clientId: UUID | undefined,
    typeId?: TrackableType,
    userId?: ID,
    transaction?: Knex.Transaction
  ): Promise<ITrackable | undefined> {
    const rows = await this.getByIdsOrClientIds(
      id ? [id] : [],
      clientId ? [clientId] : [],
      typeId,
      userId,
      transaction
    );
    return rows[0];
  }

  public async getByParentId(
    parentId: ID,
    transaction?: Knex.Transaction
  ): Promise<IAggregateChildren> {
    return this.db(DbTable.Trackables)
      .transacting(transaction)
      .where("parentId", safeId(parentId))
      .orderBy("order", "desc");
  }
}

export default TrackableFetcher;
