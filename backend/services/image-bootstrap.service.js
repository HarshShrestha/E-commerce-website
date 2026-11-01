import { publicIdFor } from "../utils/cloudinary-bootstrap.js";
/** Sequential, bounded uploads. Callback checkpoints every successful file for safe resume. */
export async function uploadBundledImages({
  images,
  manifest,
  upload,
  checkpoint,
  progress = () => {},
}) {
  const byHash = new Map(
    Object.values(manifest.files).map((file) => [file.hash, file]),
  );
  let uploadedCount = 0;
  for (const image of images) {
    let uploaded = byHash.get(image.hash);
    if (!uploaded) {
      const result = await upload(image.absolute, {
        resource_type: "image",
        public_id: publicIdFor(image.key, image.hash),
        overwrite: false,
        unique_filename: false,
        timeout: 120000,
      });
      if (!result.secure_url?.startsWith("https://res.cloudinary.com/"))
        throw new Error(`Cloudinary returned no secure URL for ${image.key}`);
      uploaded = {
        hash: image.hash,
        publicId: result.public_id,
        url: result.secure_url,
      };
      byHash.set(image.hash, uploaded);
      uploadedCount++;
      progress(image, uploadedCount);
    }
    manifest.files[image.key] = uploaded;
    await checkpoint(manifest);
  }
  return uploadedCount;
}
