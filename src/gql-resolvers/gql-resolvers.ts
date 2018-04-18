import activityResolver from "gql-resolvers/activity-resolver";
import aggregatableResolver from "gql-resolvers/aggregatable-resolver";
import aggregateResolver from "gql-resolvers/aggregate-resolver";
import audienceResolver from "gql-resolvers/audience-resolver";
import counterProgressChangedActivityResolver from "gql-resolvers/counter-progress-changed-activity-resolver";
import counterResolver from "gql-resolvers/counter-resolver";
import difficultyResolver from "gql-resolvers/difficulty-resolver";
import externalGoalReviewedActivityResolver from "gql-resolvers/external-goal-reviewed-activity-resolver";
import goalAchievedActivityResolver from "gql-resolvers/goal-achieved-activity-resolver";
import goalApprovedActivityResolver from "gql-resolvers/goal-approved-activity-resolver";
import goalRejectedActivityResolver from "gql-resolvers/goal-rejected-activity-resolver";
import goalResolver from "gql-resolvers/goal-resolver";
import gqlMutations from "gql-resolvers/gql-mutations";
import gqlQueries from "gql-resolvers/gql-queries";
import gymExerciseEntryAddedActivityResolver from "gql-resolvers/gym-exercise-entry-added-activity-resolver";
import gymExerciseEntryResolver from "gql-resolvers/gym-exercise-entry-resolver";
import gymExerciseResolver from "gql-resolvers/gym-exercise-resolver";
import numericalGoalProgressChangedActivityResolver from "gql-resolvers/numerical-goal-progress-changed-resolver";
import numericalGoalResolver from "gql-resolvers/numerical-goal-resolver";
import primitiveTrackableResolver from "gql-resolvers/primitive-trackable-resolver";
import progressDisplayModeResolver from "gql-resolvers/progress-display-mode-resolver";
import rejectReasonResolver from "gql-resolvers/reject-reason-resolver";
import reportReasonResolver from "gql-resolvers/report-reason-resolver";
import reviewStatusResolver from "gql-resolvers/review-status-resolver";
import taskGoalProgressChangedActivityResolver from "gql-resolvers/task-goal-progress-changed-activity-resolver";
import taskGoalResolver from "gql-resolvers/task-goal-resolver";
import taskResolver from "gql-resolvers/task-resolver";
import trackableActivityResolver from "gql-resolvers/trackable-activity-resolver";
import trackableAddedActivityResolver from "gql-resolvers/trackable-added-activity-resolver";
import trackableResolver from "gql-resolvers/trackable-resolver";
import trackableStatusResolver from "gql-resolvers/trackable-status-resolver";
import userResolver from "gql-resolvers/user-resolver";
import { IResolvers } from "graphql-tools";

const gqlResolvers = {
  Aggregate: aggregateResolver,
  Audience: audienceResolver,
  Counter: counterResolver,
  CounterProgressChangedActivity: counterProgressChangedActivityResolver,
  Difficulty: difficultyResolver,
  ExternalGoalReviewedActivity: externalGoalReviewedActivityResolver,
  GoalAchievedActivity: goalAchievedActivityResolver,
  GoalApprovedActivity: goalApprovedActivityResolver,
  GoalRejectedActivity: goalRejectedActivityResolver,
  GymExercise: gymExerciseResolver,
  GymExerciseEntry: gymExerciseEntryResolver,
  GymExerciseEntryAddedActivity: gymExerciseEntryAddedActivityResolver,
  IActivity: activityResolver,
  IAggregatable: aggregatableResolver,
  IGoal: goalResolver,
  IPrimitiveTrackable: primitiveTrackableResolver,
  ITrackable: trackableResolver,
  ITrackableActivity: trackableActivityResolver,
  Mutation: gqlMutations,
  NumericalGoal: numericalGoalResolver,
  NumericalGoalProgressChangedActivity: numericalGoalProgressChangedActivityResolver,
  ProgressDisplayMode: progressDisplayModeResolver,
  Query: gqlQueries,
  RejectReason: rejectReasonResolver,
  ReportReason: reportReasonResolver,
  ReviewStatus: reviewStatusResolver,
  Task: taskResolver,
  TaskGoal: taskGoalResolver,
  TaskGoalProgressChangedActivity: taskGoalProgressChangedActivityResolver,
  TrackableAddedActivity: trackableAddedActivityResolver,
  TrackableStatus: trackableStatusResolver,
  User: userResolver
} as IResolvers;

export default gqlResolvers;
