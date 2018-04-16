import Knex from "knex";
import ReportReason from "models/report-reason";
import { IUser } from "models/user";
import { IUserReport } from "models/user-report";
import UserFetcher from "services/user-fetcher";
import UserReportFetcher from "services/user-report-fetcher";
import { validateEnum, validateId } from "utils/common-validators";
import { throwIfNotEmpty } from "utils/constraint-violation-error";
import DbTable from "utils/db-table";
import ID from "utils/id";
import isIdEqual from "utils/is-id-equal";
import { IValidationErrors, setError } from "utils/validation-result";

type IReportUserCmd = (
  input: IReportUserCmdInput,
  transaction: Knex.Transaction
) => Promise<IUser>;

interface IReportUserCmdInput {
  reporterId: ID;
  reportedId: ID;
  reasonId: ReportReason;
}

function makeReportUserCmd(
  db: Knex,
  userFetcher: UserFetcher,
  userReportFetcher: UserReportFetcher
): IReportUserCmd {
  return async (input, transaction) => {
    const reportedUser = await userFetcher.get(input.reportedId, transaction);
    const report = await userReportFetcher.get(
      input.reportedId,
      input.reporterId
    );
    validateInput(input, reportedUser, report);
    await db(DbTable.UserReports)
      .transacting(transaction)
      .insert({
        reasonId: input.reasonId,
        reportedId: input.reportedId,
        reporterId: input.reporterId
      } as IUserReport);
    return reportedUser!;
  };
}

function validateInput(
  input: IReportUserCmdInput,
  reportedUser: IUser | undefined,
  report: IUserReport | undefined
) {
  const errors: IValidationErrors = {};
  let reportedIdError = validateId(reportedUser && reportedUser.id);

  if (report) {
    reportedIdError = reportedIdError || "Already reported";
  }

  if (isIdEqual(input.reportedId, input.reporterId)) {
    reportedIdError = reportedIdError || "Should be another user";
  }

  setError(errors, "reportedId", reportedIdError);
  setError(
    errors,
    "reasonId",
    validateEnum(input.reasonId, {
      values: [
        ReportReason.Abuse,
        ReportReason.Cheating,
        ReportReason.Other,
        ReportReason.Spam
      ]
    })
  );
  throwIfNotEmpty(errors);
}

export { makeReportUserCmd, IReportUserCmd };
