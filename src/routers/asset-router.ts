import express from "express";

function makeAssetRouter() {
  const router = express.Router();
  router.post("/assets", (req, res) => {
    // TODO
  });
  return router;
}

export { makeAssetRouter };
