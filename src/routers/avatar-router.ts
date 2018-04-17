import express from "express";
import { PayloadTooLarge } from "http-errors";
import { IAvatar } from "models/avatar";
import asyncMiddleware from "utils/async-middleware";
import { makeAuthMiddleware } from "utils/auth-middleware";
import ConstraintViolationError from "utils/constraint-violation-error";
import DIContainer from "utils/di-container";
import { makeImgUploadMiddleware } from "utils/img-upload-middleware";
import { ISession } from "utils/session";
import { mapErrors } from "utils/validation-result";

function makeAvatarRouter(diContainer: DIContainer) {
  const router = express.Router();
  router.post(
    "/avatars",
    makeAuthMiddleware(diContainer),
    makeImgUploadMiddleware(),
    asyncMiddleware(async (req, res, next) => {
      const input = {
        clientId: req.body.id,
        filePath: req.file && req.file.path,
        userId: (res.locals.session as ISession).userId
      };

      const avatar = await diContainer.db.transaction(async transaction => {
        try {
          return await diContainer.uploadAvatarCmd(input, transaction);
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
          uploadAvatar: {
            __typename: "UploadAvatarResponse",
            avatar: {
              __typename: "Avatar",
              id: avatar.id,
              urlMedium: avatar.urlMedium,
              urlSmall: avatar.urlSmall
            }
          }
        }
      });
    })
  );
  return router;
}

export { makeAvatarRouter };
