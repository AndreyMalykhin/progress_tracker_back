import Knex from "knex";
import { IIcon } from "models/icon";
import ID from "utils/id";

class IconService {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getByIds(ids: ID[]): Promise<IIcon[]> {
    return await this.db("icons").whereIn("id", ids);
  }

  public async getByName(name: string): Promise<IIcon | undefined> {
    return await this.db("icons")
      .where("name", name)
      .first();
  }
}

export default IconService;
