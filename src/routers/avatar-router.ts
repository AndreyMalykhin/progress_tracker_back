import express from "express";
import { makeAuthMiddleware } from "utils/auth-middleware";
import DIContainer from "utils/di-container";

function makeAvatarRouter(diContainer: DIContainer) {
  const router = express.Router();
  router.post("/avatars", makeAuthMiddleware(diContainer), (req, res) => {
    // TODO
  });
  return router;
}

export { makeAvatarRouter };
