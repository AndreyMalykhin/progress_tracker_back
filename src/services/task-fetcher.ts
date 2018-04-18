import Knex from "knex";
import { ITask } from "models/task";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";
import safeUUID from "utils/safe-uuid";
import UUID from "utils/uuid";

class TaskFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByIdOrClientId(
    id: ID | undefined,
    clientId: UUID | undefined,
    userId?: ID,
    transaction?: Knex.Transaction
  ): Promise<ITask | undefined> {
    const query = this.db(DbTable.Tasks)
      .transacting(transaction)
      .where(q => {
        if (id) {
          q.where("id", safeId(id));
        }

        if (clientId) {
          q.orWhere("clientId", safeUUID(clientId));
        }
      })
      .first();

    if (userId) {
      query.andWhere("userId", safeId(userId));
    }

    return await query;
  }

  public async getByTrackableId(id: ID): Promise<ITask[]> {
    return await this.db(DbTable.Tasks)
      .where("goalId", safeId(id))
      .orderBy("isDone", "asc");
  }

  public async getByIds(ids: ID[]): Promise<ITask[]> {
    return await this.db(DbTable.Tasks).whereIn("id", ids.map(safeId));
  }
}

export default TaskFetcher;
