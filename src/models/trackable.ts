import { TrackableStatus } from "models/trackable-status";
import ID from "utils/id";

interface ITrackable {
  id: ID;
  clientId?: ID;
  typeId: TrackableType;
  isPublic: boolean;
  title: string;
  userId: ID;
  order: number;
  statusId: TrackableStatus;
  creationDate: Date;
  statusChangeDate?: Date;
}

enum TrackableType {
  Counter = 1,
  GymExercise = 2,
  NumericalGoal = 3,
  TaskGoal = 4,
  Aggregate = 5
}

export { ITrackable, TrackableType };
