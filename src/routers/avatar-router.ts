import express from "express";

function makeAvatarRouter() {
  const router = express.Router();
  router.post("/avatars", (req, res) => {
    // TODO
  });
  return router;
}

export { makeAvatarRouter };
