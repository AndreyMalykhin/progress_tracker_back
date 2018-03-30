import addAggregateResolver from "graphql-resolvers/add-aggregate-resolver";
import addCounterProgressResolver from "graphql-resolvers/add-counter-progress-resolver";
import addCounterResolver from "graphql-resolvers/add-counter-resolver";
import addGymExerciseEntryResolver from "graphql-resolvers/add-gym-exercise-entry-resolver";
import addGymExerciseResolver from "graphql-resolvers/add-gym-exercise-resolver";
import addNumericalGoalProgressResolver from "graphql-resolvers/add-numerical-goal-progress-resolver";
import addNumericalGoalResolver from "graphql-resolvers/add-numerical-goal-resolver";
import addTaskGoalResolver from "graphql-resolvers/add-task-goal-resolver";
import addToAggregateResolver from "graphql-resolvers/add-to-aggregate-resolver";
import approveTrackableResolver from "graphql-resolvers/approve-trackable-resolver";
import breakAggregateResolver from "graphql-resolvers/break-aggregate-resolver";
import editAggregateResolver from "graphql-resolvers/edit-aggregate-resolver";
import editCounterResolver from "graphql-resolvers/edit-counter-resolver";
import editGymExerciseResolver from "graphql-resolvers/edit-gym-exercise-resolver";
import editNumericalGoalResolver from "graphql-resolvers/edit-numerical-goal-resolver";
import editTaskGoalResolver from "graphql-resolvers/edit-task-goal-resolver";
import editTaskResolver from "graphql-resolvers/edit-task-resolver";
import editUserResolver from "graphql-resolvers/edit-user-resolver";
import loginResolver from "graphql-resolvers/login-resolver";
import proveTrackableResolver from "graphql-resolvers/prove-trackable-resolver";
import rejectTrackableResolver from "graphql-resolvers/reject-trackable-resolver";
import removeTrackableResolver from "graphql-resolvers/remove-trackable-resolver";
import reportUserResolver from "graphql-resolvers/report-user-resolver";
import setTaskDoneResolver from "graphql-resolvers/set-task-done-resolver";
import setUserAvatarResolver from "graphql-resolvers/set-user-avatar-resolver";
import setUserMutedResolver from "graphql-resolvers/set-user-muted-resolver";
import unaggregateTrackableResolver from "graphql-resolvers/unaggregate-trackable-resolver";

const graphqlMutations = {
  addAggregate: addAggregateResolver,
  addCounter: addCounterResolver,
  addCounterProgress: addCounterProgressResolver,
  addGymExercise: addGymExerciseResolver,
  addGymExerciseEntry: addGymExerciseEntryResolver,
  addNumericalGoal: addNumericalGoalResolver,
  addNumericalGoalProgress: addNumericalGoalProgressResolver,
  addTaskGoal: addTaskGoalResolver,
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
