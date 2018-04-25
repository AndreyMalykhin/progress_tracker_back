import { RequestHandler } from "express";
import { Unauthorized } from "http-errors";
import jwt from "jsonwebtoken";
import Raven from "raven";
import asyncMiddleware from "utils/async-middleware";
import DIContainer from "utils/di-container";
import { ISession } from "utils/session";

function makeAuthMiddleware(
  diContainer: DIContainer,
  isTerminating = true
): RequestHandler {
  return asyncMiddleware(async (req, res, next) => {
    const authHeader = req.header("Authorization");
    let isSuccess = false;
    let error;
    let accessToken: string | undefined;
    let session: ISession | undefined;

    if (authHeader) {
      accessToken = authHeader.split(" ")[1];
    } else if (req.body && req.body.variables) {
      accessToken = req.body.variables.accessToken;
    }

    if (accessToken) {
      try {
        session = await diContainer.accessTokenIssuer.verify(accessToken);
        res.locals.session = session;
        isSuccess = true;
      } catch (e) {
        error = e;
      }
    }

    if (session) {
      Raven.mergeContext({ user: { id: session.userId } });
    }

    if (!isSuccess && isTerminating) {
      next(new Unauthorized(error.toString()));
      return;
    }

    next();
  });
}

export { makeAuthMiddleware };
