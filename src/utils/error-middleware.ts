import { ErrorRequestHandler } from "express";
import Raven from "raven";
import DIContainer from "utils/di-container";
import handleError from "utils/handle-error";

function makeErrorMiddleware(diContainer: DIContainer): ErrorRequestHandler {
  return (e, req, res, next) => {
    const errors = [handleError(e, diContainer.envConfig, res)];
    res.json({ errors });
  };
}

export { makeErrorMiddleware };
