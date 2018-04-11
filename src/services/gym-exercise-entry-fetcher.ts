import Knex from "knex";
import { IGymExercise } from "models/gym-exercise";
import DbTable from "utils/db-table";
import ID from "utils/id";
import safeId from "utils/safe-id";

class GymExerciseEntryFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByGymExerciseId(
    id: ID,
    dayCount = 3
  ): Promise<IGymExercise[]> {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - dayCount);
    return await this.db(DbTable.GymExerciseEntries)
      .where("gymExerciseId", safeId(id))
      .andWhere("date", ">", date)
      .orderBy("date", "desc");
  }
}

export default GymExerciseEntryFetcher;
