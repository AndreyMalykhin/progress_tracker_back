import multer from "multer";

function makeImgUploadMiddleware() {
  const maxFileSize = 10 * 1024 * 1024;
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const upload = multer({
    fileFilter: (req, file, callback) => {
      const isAccepted = allowedMimeTypes.indexOf(file.mimetype) !== -1;
      const error = null;
      callback(error, isAccepted);
    },
    limits: { fileSize: maxFileSize, fieldSize: maxFileSize },
    storage: multer.diskStorage({})
  });
  return upload.single("file");
}

export { makeImgUploadMiddleware };
