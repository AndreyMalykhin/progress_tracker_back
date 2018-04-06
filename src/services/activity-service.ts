import Knex from "knex";
import { ActivityType } from "models/activity";
import { ITrackableAddedActivity } from "models/trackable-added-activity";
import ID from "utils/id";

interface IAddTrackableAddedActivityInput {
  trackableId: ID;
  userId: ID;
}

class ActivityService {
  private db: Knex;

  public constructor(db: Knex) {
    this.db = db;
  }

  public async addTrackableAddedActivity(
    input: IAddTrackableAddedActivityInput,
    transaction?: Knex.Transaction
  ): Promise<ITrackableAddedActivity> {
    const { trackableId, userId } = input;
    const activity = {
      trackableId,
      typeId: ActivityType.TrackableAdded,
      userId
    };
    const rows = await this.db("activities")
      .transacting(transaction)
      .insert(activity, "*");
    return rows[0];
  }
}

export default ActivityService;
