import { ErrorRequestHandler } from "express";
import { makeLog } from "utils/log";

const log = makeLog("error-middleware");

function makeErrorMiddleware(): ErrorRequestHandler {
  return (e, req, res) => {
    // TODO
    log.error("makeErrorMiddleware", e);
    res.status(e.status || 500).json({ errors: [{ message: e.message }] });
  };
}

export { makeErrorMiddleware };
