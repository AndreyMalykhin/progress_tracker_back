import RejectReason from "models/reject-reason";
import { IReview } from "models/review";

interface IRejection extends IReview {
  reasonId: RejectReason;
}

export { IRejection };
