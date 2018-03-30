import express from "express";
import morgan from "morgan";
import { makeAssetRouter } from "routers/asset-router";
import { makeAvatarRouter } from "routers/avatar-router";
import { makeGraphqlRouter } from "routers/graphql-router";
import DIContainer from "utils/di-container";

function makeApp(diContainer: DIContainer) {
  const app = express();

  if (diContainer.envConfig.isDevEnv) {
    app.use(morgan("dev"));
  }

  app.use(makeGraphqlRouter(diContainer.envConfig));
  app.use(makeAssetRouter());
  app.use(makeAvatarRouter());
  return app;
}

export { makeApp };
