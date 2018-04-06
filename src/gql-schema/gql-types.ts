import activityConnectionDefinition from "gql-schema/activity-connection.gql";
import activityDefinition from "gql-schema/activity.gql";
import addAggregateDefinition from "gql-schema/add-aggregate.gql";
import addCounterProgressDefinition from "gql-schema/add-counter-progress.gql";
import addCounterDefinition from "gql-schema/add-counter.gql";
import addGymExerciseEntryDefinition from "gql-schema/add-gym-exercise-entry.gql";
import addGymExerciseDefinition from "gql-schema/add-gym-exercise.gql";
import addNumericalGoalProgressDefinition from "gql-schema/add-numerical-goal-progress.gql";
import addNumericalGoalDefinition from "gql-schema/add-numerical-goal.gql";
import addTaskGoalDefinition from "gql-schema/add-task-goal.gql";
import addToAggregateDefinition from "gql-schema/add-to-aggregate.gql";
import aggregatableDefinition from "gql-schema/aggregatable.gql";
import aggregateDefinition from "gql-schema/aggregate.gql";
import approveTrackableDefinition from "gql-schema/approve-trackable.gql";
import audienceDefinition from "gql-schema/audience.gql";
import breakAggregateDefinition from "gql-schema/break-aggregate.gql";
import counterProgressChangedActivityDefinition from "gql-schema/counter-progress-changed-activity.gql";
import counterDefinition from "gql-schema/counter.gql";
import difficultyDefinition from "gql-schema/difficulty.gql";
import editAggregateDefinition from "gql-schema/edit-aggregate.gql";
import editCounterDefinition from "gql-schema/edit-counter.gql";
import editGymExerciseDefinition from "gql-schema/edit-gym-exercise.gql";
import editNumericalGoalDefinition from "gql-schema/edit-numerical-goal.gql";
import editTaskGoalDefinition from "gql-schema/edit-task-goal.gql";
import editTaskDefinition from "gql-schema/edit-task.gql";
import editUserDefinition from "gql-schema/edit-user.gql";
import externalGoalReviewedActivityDefinition from "gql-schema/external-goal-reviewed-activity.gql";
import getActiveTrackablesDefinition from "gql-schema/get-active-trackables.gql";
import getActivitiesDefinition from "gql-schema/get-activities.gql";
import getArchivedTrackablesDefinition from "gql-schema/get-archived-trackables.gql";
import getFriendsDefinition from "gql-schema/get-friends.gql";
import getLeadersDefinition from "gql-schema/get-leaders.gql";
import getPendingReviewTrackablesDefinition from "gql-schema/get-pending-review-trackables.gql";
import getUserDefinition from "gql-schema/get-user.gql";
import goalAchievedActivityDefinition from "gql-schema/goal-achieved-activity.gql";
import goalApprovedActivityDefinition from "gql-schema/goal-approved-activity.gql";
import goalExpiredActivityDefinition from "gql-schema/goal-expired-activity.gql";
import goalRejectedActivityDefinition from "gql-schema/goal-rejected-activity.gql";
import goalDefinition from "gql-schema/goal.gql";
import gymExerciseEntryAddedActivityDefinition from "gql-schema/gym-exercise-entry-added-activity.gql";
import gymExerciseEntryDefinition from "gql-schema/gym-exercise-entry.gql";
import gymExerciseDefinition from "gql-schema/gym-exercise.gql";
import loginDefinition from "gql-schema/login.gql";
import numericalGoalProgressChangedActivityDefinition from "gql-schema/numerical-goal-progress-changed-activity.gql";
import numericalGoalDefinition from "gql-schema/numerical-goal.gql";
import pageInfoDefinition from "gql-schema/page-info.gql";
import primitiveTrackableDefinition from "gql-schema/primitive-trackable.gql";
import progressDisplayModeDefinition from "gql-schema/progress-display-mode.gql";
import proveTrackableDefinition from "gql-schema/prove-trackable.gql";
import rejectReasonDefinition from "gql-schema/reject-reason.gql";
import rejectTrackableDefinition from "gql-schema/reject-trackable.gql";
import removeTrackableDefinition from "gql-schema/remove-trackable.gql";
import reorderTrackableDefinition from "gql-schema/reorder-trackable.gql";
import reportReasonDefinition from "gql-schema/report-reason.gql";
import reportUserDefinition from "gql-schema/report-user.gql";
import reviewStatusDefinition from "gql-schema/review-status.gql";
import reviewTrackableResponseDefinition from "gql-schema/review-trackable-response.gql";
import schemaDefinition from "gql-schema/schema.gql";
import setTaskDoneDefinition from "gql-schema/set-task-done.gql";
import setUserAvatarDefinition from "gql-schema/set-user-avatar.gql";
import setUserMutedDefinition from "gql-schema/set-user-muted.gql";
import taskGoalProgressChangedActivityDefinition from "gql-schema/task-goal-progress-changed-activity.gql";
import taskGoalDefinition from "gql-schema/task-goal.gql";
import taskDefinition from "gql-schema/task.gql";
import trackableActivityDefinition from "gql-schema/trackable-activity.gql";
import trackableAddedActivityDefinition from "gql-schema/trackable-added-activity.gql";
import trackableConnectionDefinition from "gql-schema/trackable-connection.gql";
import trackableStatusDefinition from "gql-schema/trackable-status.gql";
import trackableDefinition from "gql-schema/trackable.gql";
import unaggregateTrackableDefinition from "gql-schema/unaggregate-trackable.gql";
import userConnectionDefinition from "gql-schema/user-connection.gql";
import userDefinition from "gql-schema/user.gql";

const gqlTypes = [
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

export default gqlTypes;
