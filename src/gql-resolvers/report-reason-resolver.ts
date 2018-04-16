import ReportReason from "models/report-reason";

const reportReasonResolver = {
  Abuse: ReportReason.Abuse,
  Cheating: ReportReason.Cheating,
  Other: ReportReason.Other,
  Spam: ReportReason.Spam
};

export default reportReasonResolver;
