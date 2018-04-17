import { ErrorRequestHandler } from "express";
import handleError from "utils/handle-error";

function makeErrorMiddleware(): ErrorRequestHandler {
  return (e, req, res, next) => {
    const errors = [handleError(e, res)];
    res.json({ errors });
  };
}

export { makeErrorMiddleware };
