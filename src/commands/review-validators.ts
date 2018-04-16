import { validateStatusIdIsPendingReview } from "commands/trackable-validators";
import { IReview } from "models/review";
import { TrackableStatus } from "models/trackable-status";
import ID from "utils/id";
import isIdEqual from "utils/is-id-equal";

function validateCanReview(
  review: IReview | undefined,
  viewerId: ID | undefined,
  trackableOwnerId: ID | undefined,
  trackableStatus: TrackableStatus | undefined
) {
  if (review) {
    return "Already reviewed";
  } else if (isIdEqual(viewerId, trackableOwnerId)) {
    return "Should be another user";
  }

  return validateStatusIdIsPendingReview(trackableStatus);
}

export { validateCanReview };
