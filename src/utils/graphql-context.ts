import { Request, Response } from "express";
import DIContainer from "utils/di-container";

interface IGraphqlContext {
  res: Response;
  req: Request;
  diContainer: DIContainer;
}

export default IGraphqlContext;
