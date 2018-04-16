import ReviewStatus from "models/review-status";
import ID from "utils/id";

interface IReview {
  userId: ID;
  trackableId: ID;
  date: Date;
  statusId: ReviewStatus;
}

export { IReview };
