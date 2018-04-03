import express from "express";
import morgan from "morgan";
import { makeAssetRouter } from "routers/asset-router";
import { makeAvatarRouter } from "routers/avatar-router";
import { makeGraphqlRouter } from "routers/graphql-router";
import DIContainer from "utils/di-container";
import { makeErrorMiddleware } from "utils/error-middleware";

function makeApp(diContainer: DIContainer) {
  const app = express();

  if (diContainer.envConfig.isDevEnv) {
    app.use(morgan("dev"));
  }

  app.use(makeGraphqlRouter(diContainer));
  app.use(makeAssetRouter(diContainer));
  app.use(makeAvatarRouter(diContainer));
  app.use(makeErrorMiddleware());
  return app;
}

export { makeApp };
