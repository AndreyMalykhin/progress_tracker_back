import Knex from "knex";
import { ITask } from "models/task";
import DbTable from "utils/db-table";
import ID from "utils/id";

class TaskFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByTrackableId(id: ID): Promise<ITask[]> {
    return await this.db(DbTable.Tasks)
      .where("goalId", id)
      .orderBy("isDone", "asc");
  }
}

export default TaskFetcher;