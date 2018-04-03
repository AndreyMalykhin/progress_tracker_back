import { Request, Response } from "express";
import DIContainer from "utils/di-container";
import { ILoaderMap } from "utils/loader-map";
import { ISession } from "utils/session";

interface IGraphqlContext {
  diContainer: DIContainer;
  loaderMap: ILoaderMap;
  session?: ISession;
}

export default IGraphqlContext;
