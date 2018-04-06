import { ITrackable, TrackableType } from "models/trackable";
import { makeRedirectResolver } from "utils/gql-resolver-utils";
import IGraphqlContext from "utils/graphql-context";

const trackableResolver = {
  __resolveType,
  status: makeRedirectResolver<ITrackable>("statusId"),
  user
};

function __resolveType(trackable: ITrackable) {
  switch (trackable.typeId) {
    case TrackableType.Aggregate:
      return "Aggregate";
    case TrackableType.Counter:
      return "Counter";
    case TrackableType.GymExercise:
      return "GymExercise";
    case TrackableType.NumericalGoal:
      return "NumericalGoal";
    case TrackableType.TaskGoal:
      return "TaskGoal";
  }

  return null;
}

function user(trackable: ITrackable, args: object, context: IGraphqlContext) {
  return context.loaderMap.user.load(trackable.userId);
}

export default trackableResolver;
