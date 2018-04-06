import Knex from "knex";
import { IAvatar } from "models/avatar";
import { IMute } from "models/mute";
import { IUser } from "models/user";
import { IUserReport } from "models/user-report";
import AvatarService from "services/avatar-service";
import { IFacebookUser } from "services/facebook-service";
import ID from "utils/id";

interface IAddInput {
  avatarId: ID;
  facebookAccessToken: string;
  facebookId: ID;
  name: string;
}

const rewardableReviewsPerDay = 4;

class UserService {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async getMute(mutedId: ID, viewerId?: ID): Promise<IMute | undefined> {
    if (!viewerId) {
      return undefined;
    }

    return await this.db("mutedUsers")
      .where({ srcId: viewerId, targetId: mutedId })
      .first();
  }

  public async getReport(
    reportedId: ID,
    viewerId?: ID
  ): Promise<IUserReport | undefined> {
    if (!viewerId) {
      return undefined;
    }

    return await this.db("reportedUsers")
      .where({ reporterId: viewerId, reportedId })
      .first();
  }

  public async add(
    input: IAddInput,
    transaction?: Knex.Transaction
  ): Promise<IUser> {
    const { avatarId, facebookAccessToken, facebookId, name } = input;
    const user: Partial<IUser> = {
      avatarId,
      facebookAccessToken,
      facebookId,
      name,
      rewardableReviewsLeft: rewardableReviewsPerDay
    };
    const rows = await this.db("users")
      .transacting(transaction)
      .insert(user, "*");
    return rows[0];
  }

  public async getByIds(ids: ID[]): Promise<IUser[]> {
    return await this.db("users").whereIn("id", ids);
  }

  public async addFriend(
    srcId: ID,
    targetId: ID,
    transaction?: Knex.Transaction
  ) {
    await this.db("friends")
      .transacting(transaction)
      .insert({ srcId, targetId });
  }

  public async removeFriend(
    srcId: ID,
    targetId: ID,
    transaction?: Knex.Transaction
  ) {
    await this.db("friends")
      .transacting(transaction)
      .where({ srcId, targetId })
      .delete()
      .limit(1);
  }

  public async getUserFriends(userId: ID): Promise<IUser[]> {
    return await this.db("friends")
      .select("users.*")
      .innerJoin("users", "friends.targetId", "users.id")
      .where("friends.srcId", userId);
  }

  public async getByFacebookId(facebookId: ID): Promise<IUser | undefined> {
    return await this.db("users")
      .where("facebookId", facebookId)
      .first();
  }

  public async setFacebookAccessToken(
    id: ID,
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
