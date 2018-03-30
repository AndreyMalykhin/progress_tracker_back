import getActivitiesResolver from "graphql-resolvers/get-activities-resolver";
import getArchivedTrackablesResolver from "graphql-resolvers/get-archived-trackables";
import getFriendsResolver from "graphql-resolvers/get-friends-resolver";
import getLeadersResolver from "graphql-resolvers/get-leaders-resolver";
import getPendingReviewTrackablesResolver from "graphql-resolvers/get-pending-review-trackables-resolver";
import getUserResolver from "graphql-resolvers/get-user-resolver";

const graphqlQueries = {
  getActivities: getActivitiesResolver,
  getArchivedTrackables: getArchivedTrackablesResolver,
  getFriends: getFriendsResolver,
  getLeaders: getLeadersResolver,
  getPendingReviewTrackables: getPendingReviewTrackablesResolver,
  getUser: getUserResolver
};

export default graphqlQueries;
