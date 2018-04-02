import Knex from "knex";
import { IAvatar } from "models/avatar";
import { IUser } from "models/user";
import AvatarService from "services/avatar-service";
import { IFacebookUser } from "services/facebook-service";

interface IAddInput {
  avatarId: string;
  facebookAccessToken: string;
  facebookId: string;
  name: string;
}

class UserService {
  private db: Knex;
  private avatarService: AvatarService;

  public constructor(db: Knex, avatarService: AvatarService) {
    this.db = db;
    this.avatarService = avatarService;
  }

  public async add(
    input: IAddInput,
    transaction?: Knex.Transaction
  ): Promise<IUser> {
    const { avatarId, facebookAccessToken, facebookId, name } = input;
    const rows = await this.db("users")
      .transacting(transaction)
      .insert(
        {
          avatarId,
          facebookAccessToken,
          facebookId,
          name
        },
        "*"
      );
    return rows[0];
  }

  public async addFriend(
    srcId: string,
    targetId: string,
    transaction?: Knex.Transaction
  ) {
    await this.db("friends")
      .transacting(transaction)
      .insert({ srcId, targetId });
  }

  public async removeFriend(
    srcId: string,
    targetId: string,
    transaction?: Knex.Transaction
  ) {
    await this.db("friends")
      .transacting(transaction)
      .where({ srcId, targetId })
      .delete()
      .limit(1);
  }

  public async getFriends(userId: string): Promise<IUser[]> {
    return await this.db("friends")
      .select("users.*")
      .innerJoin("users", "friends.targetId", "users.id")
      .where("friends.srcId", userId);
  }

  public async getByFacebookId(facebookId: string): Promise<IUser | undefined> {
    return await this.db("users")
      .where("facebookId", facebookId)
      .first();
  }

  public async setFacebookAccessToken(
    id: string,
    token: string,
    transaction?: Knex.Transaction
  ) {
    await this.db("users")
      .transacting(transaction)
      .update("facebookAccessToken", token)
      .where("id", id)
      .limit(1);
  }
}

export default UserService;
