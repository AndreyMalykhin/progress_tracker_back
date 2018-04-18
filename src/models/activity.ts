import ID from "utils/id";

interface IActivity {
  id: ID;
  typeId: ActivityType;
  date: Date;
  userId: ID;
  isPublic: boolean;
}

enum ActivityType {
  ExternalGoalReviewed = 1,
  GoalAchieved = 2,
  GoalRejected = 3,
  GoalApproved = 4,
  GymExerciseEntryAdded = 5,
  TaskGoalProgressChanged = 6,
  NumericalGoalProgressChanged = 7,
  CounterProgressChanged = 8,
  TrackableAdded = 9
}

export { ActivityType, IActivity };
