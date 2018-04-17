import express from "express";
import { PayloadTooLarge } from "http-errors";
import { IAsset } from "models/asset";
import asyncMiddleware from "utils/async-middleware";
import { makeAuthMiddleware } from "utils/auth-middleware";
import ConstraintViolationError from "utils/constraint-violation-error";
import DIContainer from "utils/di-container";
import { makeImgUploadMiddleware } from "utils/img-upload-middleware";
import { ISession } from "utils/session";
import { mapErrors } from "utils/validation-result";

function makeAssetRouter(diContainer: DIContainer) {
  const router = express.Router();
  const imgUploadMiddleware = makeImgUploadMiddleware();
  router.post(
    "/assets",
    makeAuthMiddleware(diContainer),
    makeImgUploadMiddleware(),
    asyncMiddleware(async (req, res, next) => {
      const input = {
        clientId: req.body.id,
        filePath: req.file && req.file.path,
        userId: (res.locals.session as ISession).userId
      };

      const asset = await diContainer.db.transaction(async transaction => {
        try {
          return await diContainer.uploadAssetCmd(input, transaction);
        } catch (e) {
          if (e instanceof ConstraintViolationError) {
            mapErrors(e.validationResult, {
              clientId: { field: "id" },
              filePath: { field: "file" }
            });
          }

          throw e;
        }
      });

      res.json({
        data: {
          __typename: "Mutation",
          uploadAsset: {
            __typename: "UploadAssetResponse",
            asset: {
              __typename: "Asset",
              id: asset.id,
              urlMedium: asset.urlMedium
            }
          }
        }
      });
    })
  );
  return router;
}

export { makeAssetRouter };
