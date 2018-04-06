import getActiveTrackablesResolver from "gql-resolvers/get-active-trackables-resolver";
import getActivitiesResolver from "gql-resolvers/get-activities-resolver";
import getArchivedTrackablesResolver from "gql-resolvers/get-archived-trackables";
import getFriendsResolver from "gql-resolvers/get-friends-resolver";
import getLeadersResolver from "gql-resolvers/get-leaders-resolver";
import getPendingReviewTrackablesResolver from "gql-resolvers/get-pending-review-trackables-resolver";
import getUserResolver from "gql-resolvers/get-user-resolver";

const gqlQueries = {
  getActiveTrackables: getActiveTrackablesResolver,
  getActivities: getActivitiesResolver,
  getArchivedTrackables: getArchivedTrackablesResolver,
  getFriends: getFriendsResolver,
  getLeaders: getLeadersResolver,
  getPendingReviewTrackables: getPendingReviewTrackablesResolver,
  getUser: getUserResolver
};

export default gqlQueries;
