import { RequestHandler } from "express";
import { PayloadTooLarge } from "http-errors";
import multer from "multer";

function makeImgUploadMiddleware(): RequestHandler {
  const maxFileSize = 10 * 1024 * 1024;
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const upload = multer({
    fileFilter: (req2, file, callback) => {
      const isAccepted = allowedMimeTypes.indexOf(file.mimetype) !== -1;
      const error = null;
      callback(error, isAccepted);
    },
    limits: { fileSize: maxFileSize, fieldSize: maxFileSize },
    storage: multer.diskStorage({})
  });
  const uploadMiddleware = upload.single("file");
  return (req, res, next) => {
    uploadMiddleware(req, res, e => {
      if (e) {
        if (e.code === "LIMIT_FILE_SIZE") {
          next(new PayloadTooLarge(e.toString()));
          return;
        }

        next(e);
        return;
      }

      next();
    });
  };
}

export { makeImgUploadMiddleware };
