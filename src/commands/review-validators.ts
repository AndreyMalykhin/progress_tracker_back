import { IReview } from "models/review";

function validateNotReviewed(review: IReview | undefined) {
  return review ? "Already reviewed" : undefined;
}

export { validateNotReviewed };
