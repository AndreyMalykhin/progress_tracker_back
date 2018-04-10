import Knex from "knex";
import Difficulty from "models/difficulty";
import { INumericalGoal } from "models/numerical-goal";
import ProgressDisplayMode from "models/progress-display-mode";
import { IReview } from "models/review";
import { ITask } from "models/task";
import { ITaskGoal } from "models/task-goal";
import { ITrackable, TrackableType } from "models/trackable";
import { TrackableStatus } from "models/trackable-status";
import {
  validateEnum,
  validateLength,
  validateList,
  validateRange,
  validateReference,
  validateUUID
} from "utils/common-validators";
import ConstraintViolationError from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import {
  hasErrors,
  isEmpty,
  IValidationErrors,
  setError
} from "utils/validation-result";

class TrackableFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
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
      .andWhere("userId", ownerId)
      .orderBy("order", "desc")
      .limit(limit);

    if (afterOrder) {
      query.andWhere("order", "<", afterOrder);
    }

    if (!viewerId || viewerId !== ownerId) {
      query.andWhere("isPublic", true);
    }

    return await query;
  }

  public async getByIds(ids: ID[]): Promise<ITrackable[]> {
    return await this.db(DbTable.Trackables).whereIn("id", ids);
  }

  public async getByIdsOrClientIds(
    ids: ID[],
    clientIds: ID[],
    userId?: ID
  ): Promise<ITrackable[]> {
    if (!ids.length && !clientIds.length) {
      return [];
    }

    const query = this.db(DbTable.Trackables).where(q => {
      if (ids.length) {
        q.whereIn("id", ids);
      }

      if (clientIds.length) {
        q.orWhereIn("clientId", clientIds);
      }
    });

    if (userId) {
      query.andWhere("userId", userId);
    }

    return await query;
  }

  public async getByIdOrClientId(
    id?: ID,
    clientId?: ID,
    userId?: ID
  ): Promise<ITrackable | undefined> {
    const rows = await this.getByIdsOrClientIds(
      id ? [id] : [],
      clientId ? [clientId] : [],
      userId
    );
    return rows[0];
  }

  public async getByParentId(parentId: ID): Promise<ITrackable[]> {
    return this.db(DbTable.Trackables)
      .where("parentId", parentId)
      .orderBy("order", "desc");
  }
}

export default TrackableFetcher;
