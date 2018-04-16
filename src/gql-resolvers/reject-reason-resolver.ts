import RejectReason from "models/reject-reason";

const rejectReasonResolver = {
  Abuse: RejectReason.Abuse,
  Fake: RejectReason.Fake,
  Other: RejectReason.Other,
  Spam: RejectReason.Spam
};

export default rejectReasonResolver;
