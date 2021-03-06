import ID from "utils/id";

interface IUser {
  id: ID;
  avatarId: ID;
  name: string;
  facebookId: ID;
  facebookAccessToken: string;
  rating: number;
  rewardableReviewsLeft: number;
  friendsSyncStartDate?: Date;
  creationDate: Date;
  email: string;
}

const rewardableReviewsPerDay = 4;
const bonusRatingForReview = 1;

export { IUser, rewardableReviewsPerDay, bonusRatingForReview };
