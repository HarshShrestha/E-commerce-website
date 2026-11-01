import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { fail } from "../utils/ApiError.js";
/** Upload validated in-memory files; no temporary disk files or provider logic in controllers. */
export async function uploadProductImages(files) {
  if (!files.length)
    throw fail(400, "Upload at least one JPG, PNG or WebP image (up to 5 MB).");
  if (
    !env.cloudinary.cloud_name ||
    !env.cloudinary.api_key ||
    !env.cloudinary.api_secret
  )
    throw fail(503, "Product uploads require Cloudinary configuration.");
  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "image", folder: "forever" },
              (error, result) =>
                error ? reject(error) : resolve(result.secure_url),
            )
            .end(file.buffer);
        }),
    ),
  );
}
