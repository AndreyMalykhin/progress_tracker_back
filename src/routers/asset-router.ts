import express from "express";
import { makeAuthMiddleware } from "utils/auth-middleware";
import DIContainer from "utils/di-container";

function makeAssetRouter(diContainer: DIContainer) {
  const router = express.Router();
  router.use(makeAuthMiddleware(diContainer));
  router.post("/assets", (req, res) => {
    // TODO
  });
  return router;
}

export { makeAssetRouter };
