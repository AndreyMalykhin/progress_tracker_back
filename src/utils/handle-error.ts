import { Response } from "express";
import { GraphQLError } from "graphql";
import { BadRequest, HttpError } from "http-errors";
import ConstraintViolationError from "utils/constraint-violation-error";
import { makeLog } from "utils/log";

const log = makeLog("handle-error");

function handleError(error: any, response: Response) {
  // TODO
  log.error("handleError", error);
  let status;
  let msg;
  let data;

  if (error instanceof GraphQLError) {
    error = error.originalError || new BadRequest(error.message);
  }

  if (error instanceof ConstraintViolationError) {
    status = 400;
    msg = error.message;
    data = { violations: error.validationResult.errors };
  } else if (error instanceof HttpError) {
    status = error.status;
    msg = error.message;
  } else if (error instanceof Error) {
    status = 500;
    msg = error.message;
  } else {
    status = 500;
    msg = "Unexpected error";
  }

  response.status(status);
  return { msg, data };
}

export default handleError;
