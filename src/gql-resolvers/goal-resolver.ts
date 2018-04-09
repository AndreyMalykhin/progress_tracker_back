import { IGoal } from "models/goal";
import { ITrackable } from "models/trackable";
import IGqlContext from "utils/gql-context";
import { makeRedirectResolver } from "utils/gql-resolver-utils";

const goalResolver = {
  myReviewStatus,
  progressDisplayMode: makeRedirectResolver<IGoal>("progressDisplayModeId"),
  proofPhotoUrlMedium
};

async function myReviewStatus(
  trackable: ITrackable,
  args: object,
  context: IGqlContext
) {
  if (!context.session) {
    return null;
  }

  const review = await context.diContainer.reviewFetcher.get(
    trackable.id,
    context.session.userId
  );
  return review && review.status;
}

async function proofPhotoUrlMedium(
  trackable: IGoal,
  args: object,
  context: IGqlContext
) {
  if (!trackable.proofPhotoId) {
    return null;
  }

  const photo = await context.loaderMap.asset.load(trackable.proofPhotoId);
  return photo && photo.urlMedium;
}

export default goalResolver;
