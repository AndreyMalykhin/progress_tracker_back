import Difficulty from "models/difficulty";
import { IReview } from "models/review";

interface IApproval extends IReview {
  difficulty: Difficulty;
}

export { IApproval };
