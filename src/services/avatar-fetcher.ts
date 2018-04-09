import Knex from "knex";
import { IAvatar } from "models/avatar";
import ID from "utils/id";

class AvatarFetcher {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async get(id: ID): Promise<IAvatar | undefined> {
    return await this.db("avatars")
      .where("id", id)
      .first();
  }

  public async getByIds(ids: ID[]): Promise<IAvatar[]> {
    return await this.db("avatars").whereIn("id", ids);
  }
}

export default AvatarFetcher;
