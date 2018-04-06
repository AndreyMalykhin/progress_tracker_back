import { TrackableStatus } from "models/trackable-status";

const trackableStatusResolver = {
  Active: TrackableStatus.Active,
  Approved: TrackableStatus.Approved,
  Expired: TrackableStatus.Expired,
  PendingProof: TrackableStatus.PendingProof,
  PendingReview: TrackableStatus.PendingReview,
  Rejected: TrackableStatus.Rejected
};

export default trackableStatusResolver;
