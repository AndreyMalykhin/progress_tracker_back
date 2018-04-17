import { RequestHandler } from "express";

function asyncMiddleware(middleware: RequestHandler): RequestHandler {
  return (req, res, next) => {
    middleware(req, res, next).catch(next);
  };
}

export default asyncMiddleware;
