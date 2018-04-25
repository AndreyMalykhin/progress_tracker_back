import { Response } from "express";
import { GraphQLError } from "graphql";
import { BadRequest, HttpError } from "http-errors";
import ConstraintViolationError from "utils/constraint-violation-error";
import { IEnvConfig } from "utils/env-config";
import { makeLog } from "utils/log";

const log = makeLog("handle-error");

function handleError(error: any, envConfig: IEnvConfig, response: Response) {
  log.error("handleError", error);
  let status: number;
  let msg: string;
  let data: object | undefined;

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
    msg = envConfig.isDevEnv ? error.message : "Internal server error";
  } else {
    status = 500;
    msg = "Internal server error";
  }

  response.status(status);
  return { msg, data };
}

export default handleError;
