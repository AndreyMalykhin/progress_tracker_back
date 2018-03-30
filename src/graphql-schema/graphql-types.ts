import activityConnectionDefinition from "graphql-schema/activity-connection.gql";
import activityDefinition from "graphql-schema/activity.gql";
import addAggregateDefinition from "graphql-schema/add-aggregate.gql";
import addCounterProgressDefinition from "graphql-schema/add-counter-progress.gql";
import addCounterDefinition from "graphql-schema/add-counter.gql";
import addGymExerciseEntryDefinition from "graphql-schema/add-gym-exercise-entry.gql";
import addGymExerciseDefinition from "graphql-schema/add-gym-exercise.gql";
import addNumericalGoalProgressDefinition from "graphql-schema/add-numerical-goal-progress.gql";
import addNumericalGoalDefinition from "graphql-schema/add-numerical-goal.gql";
import addTaskGoalDefinition from "graphql-schema/add-task-goal.gql";
import addToAggregateDefinition from "graphql-schema/add-to-aggregate.gql";
import aggregatableDefinition from "graphql-schema/aggregatable.gql";
import aggregateDefinition from "graphql-schema/aggregate.gql";
import approveTrackableDefinition from "graphql-schema/approve-trackable.gql";
import audienceDefinition from "graphql-schema/audience.gql";
import breakAggregateDefinition from "graphql-schema/break-aggregate.gql";
import counterProgressChangedActivityDefinition from "graphql-schema/counter-progress-changed-activity.gql";
import counterDefinition from "graphql-schema/counter.gql";
import difficultyDefinition from "graphql-schema/difficulty.gql";
import editAggregateDefinition from "graphql-schema/edit-aggregate.gql";
import editCounterDefinition from "graphql-schema/edit-counter.gql";
import editGymExerciseDefinition from "graphql-schema/edit-gym-exercise.gql";
import editNumericalGoalDefinition from "graphql-schema/edit-numerical-goal.gql";
import editTaskGoalDefinition from "graphql-schema/edit-task-goal.gql";
import editTaskDefinition from "graphql-schema/edit-task.gql";
import editUserDefinition from "graphql-schema/edit-user.gql";
import externalGoalReviewedActivityDefinition from "graphql-schema/external-goal-reviewed-activity.gql";
import getActiveTrackablesDefinition from "graphql-schema/get-active-trackables.gql";
import getActivitiesDefinition from "graphql-schema/get-activities.gql";
import getArchivedTrackablesDefinition from "graphql-schema/get-archived-trackables.gql";
import getFriendsDefinition from "graphql-schema/get-friends.gql";
import getLeadersDefinition from "graphql-schema/get-leaders.gql";
import getPendingReviewTrackablesDefinition from "graphql-schema/get-pending-review-trackables.gql";
import getUserDefinition from "graphql-schema/get-user.gql";
import goalAchievedActivityDefinition from "graphql-schema/goal-achieved-activity.gql";
import goalApprovedActivityDefinition from "graphql-schema/goal-approved-activity.gql";
import goalExpiredActivityDefinition from "graphql-schema/goal-expired-activity.gql";
import goalRejectedActivityDefinition from "graphql-schema/goal-rejected-activity.gql";
import goalDefinition from "graphql-schema/goal.gql";
import gymExerciseEntryAddedActivityDefinition from "graphql-schema/gym-exercise-entry-added-activity.gql";
import gymExerciseEntryDefinition from "graphql-schema/gym-exercise-entry.gql";
import gymExerciseDefinition from "graphql-schema/gym-exercise.gql";
import loginDefinition from "graphql-schema/login.gql";
import numericalGoalProgressChangedActivityDefinition from "graphql-schema/numerical-goal-progress-changed-activity.gql";
import numericalGoalDefinition from "graphql-schema/numerical-goal.gql";
import pageInfoDefinition from "graphql-schema/page-info.gql";
import primitiveTrackableDefinition from "graphql-schema/primitive-trackable.gql";
import progressDisplayModeDefinition from "graphql-schema/progress-display-mode.gql";
import proveTrackableDefinition from "graphql-schema/prove-trackable.gql";
import rejectReasonDefinition from "graphql-schema/reject-reason.gql";
import rejectTrackableDefinition from "graphql-schema/reject-trackable.gql";
import removeTrackableDefinition from "graphql-schema/remove-trackable.gql";
import reorderTrackableDefinition from "graphql-schema/reorder-trackable.gql";
import reportReasonDefinition from "graphql-schema/report-reason.gql";
import reportUserDefinition from "graphql-schema/report-user.gql";
import reviewStatusDefinition from "graphql-schema/review-status.gql";
import reviewTrackableResponseDefinition from "graphql-schema/review-trackable-response.gql";
import schemaDefinition from "graphql-schema/schema.gql";
import setTaskDoneDefinition from "graphql-schema/set-task-done.gql";
import setUserAvatarDefinition from "graphql-schema/set-user-avatar.gql";
import setUserMutedDefinition from "graphql-schema/set-user-muted.gql";
import taskGoalProgressChangedActivityDefinition from "graphql-schema/task-goal-progress-changed-activity.gql";
import taskGoalDefinition from "graphql-schema/task-goal.gql";
import taskDefinition from "graphql-schema/task.gql";
import trackableActivityDefinition from "graphql-schema/trackable-activity.gql";
import trackableAddedActivityDefinition from "graphql-schema/trackable-added-activity.gql";
import trackableConnectionDefinition from "graphql-schema/trackable-connection.gql";
import trackableStatusDefinition from "graphql-schema/trackable-status.gql";
import trackableDefinition from "graphql-schema/trackable.gql";
import unaggregateTrackableDefinition from "graphql-schema/unaggregate-trackable.gql";
import userConnectionDefinition from "graphql-schema/user-connection.gql";
import userDefinition from "graphql-schema/user.gql";

const graphqlTypes = [
  schemaDefinition,
  userConnectionDefinition,
  activityConnectionDefinition,
  trackableConnectionDefinition,
  pageInfoDefinition,
  gymExerciseDefinition,
  gymExerciseEntryDefinition,
  taskDefinition,
  taskGoalDefinition,
  numericalGoalDefinition,
  counterDefinition,
  aggregateDefinition,
  userDefinition,
  goalDefinition,
  aggregatableDefinition,
  primitiveTrackableDefinition,
  trackableDefinition,
  audienceDefinition,
  difficultyDefinition,
  reportReasonDefinition,
  rejectReasonDefinition,
  reviewStatusDefinition,
  progressDisplayModeDefinition,
  trackableStatusDefinition,
  reviewTrackableResponseDefinition,

  // activities
  activityDefinition,
  trackableActivityDefinition,
  externalGoalReviewedActivityDefinition,
  goalAchievedActivityDefinition,
  goalRejectedActivityDefinition,
  goalApprovedActivityDefinition,
  gymExerciseEntryAddedActivityDefinition,
  taskGoalProgressChangedActivityDefinition,
  numericalGoalProgressChangedActivityDefinition,
  counterProgressChangedActivityDefinition,
  trackableAddedActivityDefinition,

  // queries
  getLeadersDefinition,
  getActivitiesDefinition,
  getPendingReviewTrackablesDefinition,
  getArchivedTrackablesDefinition,
  getActiveTrackablesDefinition,
  getFriendsDefinition,
  getUserDefinition,

  // mutations
  reorderTrackableDefinition,
  unaggregateTrackableDefinition,
  removeTrackableDefinition,
  rejectTrackableDefinition,
  approveTrackableDefinition,
  proveTrackableDefinition,
  setUserAvatarDefinition,
  setUserMutedDefinition,
  reportUserDefinition,
  editUserDefinition,
  loginDefinition,
  editGymExerciseDefinition,
  addGymExerciseDefinition,
  addGymExerciseEntryDefinition,
  addCounterProgressDefinition,
  editCounterDefinition,
  addCounterDefinition,
  addNumericalGoalDefinition,
  editNumericalGoalDefinition,
  addNumericalGoalProgressDefinition,
  editTaskDefinition,
  setTaskDoneDefinition,
  editTaskGoalDefinition,
  addTaskGoalDefinition,
  breakAggregateDefinition,
  editAggregateDefinition,
  addAggregateDefinition,
  addToAggregateDefinition
];

export default graphqlTypes;
