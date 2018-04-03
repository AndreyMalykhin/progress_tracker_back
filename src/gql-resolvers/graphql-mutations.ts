import addAggregateResolver from "gql-resolvers/add-aggregate-resolver";
import addCounterProgressResolver from "gql-resolvers/add-counter-progress-resolver";
import addCounterResolver from "gql-resolvers/add-counter-resolver";
import addGymExerciseEntryResolver from "gql-resolvers/add-gym-exercise-entry-resolver";
import addGymExerciseResolver from "gql-resolvers/add-gym-exercise-resolver";
import addNumericalGoalProgressResolver from "gql-resolvers/add-numerical-goal-progress-resolver";
import addNumericalGoalResolver from "gql-resolvers/add-numerical-goal-resolver";
import addTaskGoalResolver from "gql-resolvers/add-task-goal-resolver";
import addToAggregateResolver from "gql-resolvers/add-to-aggregate-resolver";
import approveTrackableResolver from "gql-resolvers/approve-trackable-resolver";
import breakAggregateResolver from "gql-resolvers/break-aggregate-resolver";
import checkAuthResolver from "gql-resolvers/check-auth-resolver";
import editAggregateResolver from "gql-resolvers/edit-aggregate-resolver";
import editCounterResolver from "gql-resolvers/edit-counter-resolver";
import editGymExerciseResolver from "gql-resolvers/edit-gym-exercise-resolver";
import editNumericalGoalResolver from "gql-resolvers/edit-numerical-goal-resolver";
import editTaskGoalResolver from "gql-resolvers/edit-task-goal-resolver";
import editTaskResolver from "gql-resolvers/edit-task-resolver";
import editUserResolver from "gql-resolvers/edit-user-resolver";
import loginResolver from "gql-resolvers/login-resolver";
import proveTrackableResolver from "gql-resolvers/prove-trackable-resolver";
import rejectTrackableResolver from "gql-resolvers/reject-trackable-resolver";
import removeTrackableResolver from "gql-resolvers/remove-trackable-resolver";
import reportUserResolver from "gql-resolvers/report-user-resolver";
import setTaskDoneResolver from "gql-resolvers/set-task-done-resolver";
import setUserAvatarResolver from "gql-resolvers/set-user-avatar-resolver";
import setUserMutedResolver from "gql-resolvers/set-user-muted-resolver";
import unaggregateTrackableResolver from "gql-resolvers/unaggregate-trackable-resolver";
import { combineResolvers } from "graphql-resolvers";

const graphqlMutations = {
  addAggregate: addAggregateResolver,
  addCounter: addCounterResolver,
  addCounterProgress: addCounterProgressResolver,
  addGymExercise: addGymExerciseResolver,
  addGymExerciseEntry: addGymExerciseEntryResolver,
  addNumericalGoal: addNumericalGoalResolver,
  addNumericalGoalProgress: addNumericalGoalProgressResolver,
  addTaskGoal: combineResolvers(checkAuthResolver, addTaskGoalResolver),
  addToAggregate: addToAggregateResolver,
  approveTrackable: approveTrackableResolver,
  breakAggregate: breakAggregateResolver,
  editAggregate: editAggregateResolver,
  editCounter: editCounterResolver,
  editGymExercise: editGymExerciseResolver,
  editNumericalGoal: editNumericalGoalResolver,
  editTask: editTaskResolver,
  editTaskGoal: editTaskGoalResolver,
  editUser: editUserResolver,
  login: loginResolver,
  proveTrackable: proveTrackableResolver,
  rejectTrackable: rejectTrackableResolver,
  removeTrackable: removeTrackableResolver,
  reportUser: reportUserResolver,
  setTaskDone: setTaskDoneResolver,
  setUserAvatar: setUserAvatarResolver,
  setUserMuted: setUserMutedResolver,
  unaggregateTrackable: unaggregateTrackableResolver
};

export default graphqlMutations;
