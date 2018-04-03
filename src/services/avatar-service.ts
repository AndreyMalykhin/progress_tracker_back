import Knex from "knex";
import { IAvatar } from "models/avatar";

interface IAddInput {
  urlSmall: string;
  urlMedium: string;
}

class AvatarService {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async add(
    input: IAddInput,
    transaction?: Knex.Transaction
  ): Promise<IAvatar> {
    const { urlSmall, urlMedium } = input;
    const rows = await this.db("avatars")
      .transacting(transaction)
      .insert({ urlSmall, urlMedium }, "*");
    return rows[0];
  }

  public async getById(id: string): Promise<IAvatar> {
    return await this.db("avatars")
      .where("id", id)
      .first();
  }

  public async getByIds(ids: string[]): Promise<IAvatar[]> {
    return await this.db("avatars").whereIn("id", ids);
  }
}

export default AvatarService;
