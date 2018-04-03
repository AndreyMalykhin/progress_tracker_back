import getActivitiesResolver from "gql-resolvers/get-activities-resolver";
import getArchivedTrackablesResolver from "gql-resolvers/get-archived-trackables";
import getFriendsResolver from "gql-resolvers/get-friends-resolver";
import getLeadersResolver from "gql-resolvers/get-leaders-resolver";
import getPendingReviewTrackablesResolver from "gql-resolvers/get-pending-review-trackables-resolver";
import getUserResolver from "gql-resolvers/get-user-resolver";

const graphqlQueries = {
  getActivities: getActivitiesResolver,
  getArchivedTrackables: getArchivedTrackablesResolver,
  getFriends: getFriendsResolver,
  getLeaders: getLeadersResolver,
  getPendingReviewTrackables: getPendingReviewTrackablesResolver,
  getUser: getUserResolver
};

export default graphqlQueries;
