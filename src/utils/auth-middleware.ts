import { RequestHandler } from "express";
import { Unauthorized } from "http-errors";
import jwt from "jsonwebtoken";
import asyncMiddleware from "utils/async-middleware";
import DIContainer from "utils/di-container";

function makeAuthMiddleware(
  diContainer: DIContainer,
  isTerminating = true
): RequestHandler {
  return asyncMiddleware(async (req, res, next) => {
    const authHeader = req.header("Authorization");
    let isSuccess = false;
    let error;
    let accessToken;

    if (authHeader) {
      accessToken = authHeader.split(" ")[1];
    } else if (req.body && req.body.variables) {
      accessToken = req.body.variables.accessToken;
    }

    if (accessToken) {
      try {
        res.locals.session = await diContainer.accessTokenIssuer.verify(
          accessToken
        );
        isSuccess = true;
      } catch (e) {
        error = e;
      }
    }

    if (!isSuccess && isTerminating) {
      next(new Unauthorized(error.toString()));
      return;
    }

    next();
  });
}

export { makeAuthMiddleware };
