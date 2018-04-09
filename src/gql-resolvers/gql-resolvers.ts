import aggregatableResolver from "gql-resolvers/aggregatable-resolver";
import counterResolver from "gql-resolvers/counter-resolver";
import difficultyResolver from "gql-resolvers/difficulty-resolver";
import goalResolver from "gql-resolvers/goal-resolver";
import gqlMutations from "gql-resolvers/gql-mutations";
import gqlQueries from "gql-resolvers/gql-queries";
import gymExerciseEntryResolver from "gql-resolvers/gym-exercise-entry-resolver";
import gymExerciseResolver from "gql-resolvers/gym-exercise-resolver";
import numericalGoalResolver from "gql-resolvers/numerical-goal-resolver";
import primitiveTrackableResolver from "gql-resolvers/primitive-trackable-resolver";
import progressDisplayModeResolver from "gql-resolvers/progress-display-mode-resolver";
import reviewStatusResolver from "gql-resolvers/review-status-resolver";
import taskGoalResolver from "gql-resolvers/task-goal-resolver";
import taskResolver from "gql-resolvers/task-resolver";
import trackableResolver from "gql-resolvers/trackable-resolver";
import trackableStatusResolver from "gql-resolvers/trackable-status-resolver";
import userResolver from "gql-resolvers/user-resolver";
import { IResolvers } from "graphql-tools";

const gqlResolvers = {
  Counter: counterResolver,
  Difficulty: difficultyResolver,
  GymExercise: gymExerciseResolver,
  GymExerciseEntry: gymExerciseEntryResolver,
  IAggregatable: aggregatableResolver,
  IGoal: goalResolver,
  IPrimitiveTrackable: primitiveTrackableResolver,
  ITrackable: trackableResolver,
  Mutation: gqlMutations,
  NumericalGoal: numericalGoalResolver,
  ProgressDisplayMode: progressDisplayModeResolver,
  Query: gqlQueries,
  ReviewStatus: reviewStatusResolver,
  Task: taskResolver,
  TaskGoal: taskGoalResolver,
  TrackableStatus: trackableStatusResolver,
  User: userResolver
} as IResolvers;

export default gqlResolvers;
