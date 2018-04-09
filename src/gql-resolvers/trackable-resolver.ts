import { ITrackable, TrackableType } from "models/trackable";
import IGqlContext from "utils/gql-context";
import { makeRedirectResolver } from "utils/gql-resolver-utils";

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

function user(trackable: ITrackable, args: object, context: IGqlContext) {
  return context.loaderMap.user.load(trackable.userId);
}

export default trackableResolver;
