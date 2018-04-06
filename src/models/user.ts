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

export { IUser };
