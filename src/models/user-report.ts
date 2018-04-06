import ReportReason from "models/report-reason";
import ID from "utils/id";

interface IUserReport {
  reporterId: ID;
  reportedId: ID;
  date: Date;
  reasonId: ReportReason;
}

export { IUserReport };
