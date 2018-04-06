import ReviewStatus from "models/review-status";

const reviewStatusResolver = {
  Approved: ReviewStatus.Approved,
  Rejected: ReviewStatus.Rejected
};

export default reviewStatusResolver;
