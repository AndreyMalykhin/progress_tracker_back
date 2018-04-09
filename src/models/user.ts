import ID from "utils/id";

interface IUser {
  id: ID;
  avatarId: ID;
  name: string;
  facebookId: ID;
  facebookAccessToken: string;
  rating: number;
  rewardableReviewsLeft: number;
}

const rewardableReviewsPerDay = 4;

export { IUser, rewardableReviewsPerDay };
