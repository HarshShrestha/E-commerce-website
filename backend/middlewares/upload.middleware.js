import multer from "multer";
import {
  IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from "../constants/product.constants.js";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 4, fields: 12 },
  fileFilter: (_req, file, done) =>
    done(null, IMAGE_TYPES.includes(file.mimetype)),
});
export const uploadFields = upload.fields(
  [1, 2, 3, 4].map((n) => ({ name: "image" + n, maxCount: 1 })),
);
