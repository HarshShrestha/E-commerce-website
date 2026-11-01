import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import {
  discoverImages,
  imageHash,
  publicIdFor,
  rewriteCatalog,
} from "../backend/utils/cloudinary-bootstrap.js";
import { uploadBundledImages } from "../backend/services/image-bootstrap.service.js";
const root = new URL("../", import.meta.url).pathname;
const image = (key, hash) => ({ key, hash, absolute: "/test/" + key });
const response = (id) => ({
  public_id: id,
  secure_url: "https://res.cloudinary.com/test/image/upload/" + id,
});
test("image IDs are deterministic, versioned by contents and safe", () => {
  const hash = imageHash(Buffer.from("sample"));
  assert.equal(publicIdFor("a.png", hash), publicIdFor("a.png", hash));
  assert.notEqual(
    publicIdFor("a.png", hash),
    publicIdFor("a.png", imageHash(Buffer.from("changed"))),
  );
  assert.match(
    publicIdFor("bad name!.png", hash),
    /^forever\/bootstrap\/bad-name--[a-f0-9]{20}$/,
  );
});
test("bundled image discovery covers product, editorial and admin assets", async () => {
  const images = await discoverImages(root);
  for (const key of [
    "backend/public/catalog/p_img1.png",
    "frontend/src/assets/hero_img.png",
    "frontend/src/assets/about_img.png",
    "admin/src/assets/logo.png",
  ])
    assert.ok(
      images.some((image) => image.key === key),
      key,
    );
  assert.equal(
    images.find((i) => i.key === "backend/public/catalog/p_img1.png").hash,
    images.find((i) => i.key === "frontend/src/assets/p_img1.png").hash,
  );
});
test("duplicate images upload once, checkpoint each reference, then resume with no uploads", async () => {
  const manifest = { files: {} },
    images = [
      image("a.png", "hash-a"),
      image("copy.png", "hash-a"),
      image("b.png", "hash-b"),
    ];
  let requests = 0,
    checkpoints = 0;
  const upload = async (_file, options) => {
    requests++;
    assert.equal(options.overwrite, false);
    return response(options.public_id);
  };
  const count = await uploadBundledImages({
    images,
    manifest,
    upload,
    checkpoint: async () => checkpoints++,
  });
  assert.equal(count, 2);
  assert.equal(requests, 2);
  assert.equal(checkpoints, 3);
  assert.equal(manifest.files["a.png"].url, manifest.files["copy.png"].url);
  assert.equal(
    await uploadBundledImages({
      images,
      manifest,
      upload,
      checkpoint: async () => {},
    }),
    0,
  );
  assert.equal(requests, 2);
});
test("interrupted uploads preserve successful checkpoint and resume remaining files", async () => {
  const images = [image("a.png", "hash-a"), image("b.png", "hash-b")];
  const manifest = { files: {} };
  let saved;
  await assert.rejects(
    uploadBundledImages({
      images,
      manifest,
      upload: async (file, options) => {
        if (file.endsWith("b.png")) throw new Error("offline");
        return response(options.public_id);
      },
      checkpoint: async (data) => {
        saved = structuredClone(data);
      },
    }),
    /offline/,
  );
  assert.ok(saved.files["a.png"]);
  assert.equal(saved.files["b.png"], undefined);
  let requests = 0;
  await uploadBundledImages({
    images,
    manifest: saved,
    upload: async (_file, options) => {
      requests++;
      return response(options.public_id);
    },
    checkpoint: async () => {},
  });
  assert.equal(requests, 1);
});
test("catalog rewrite covers galleries and preserves product IDs, metadata and remote URLs", () => {
  const catalog = [
    {
      _id: "same",
      name: "Shirt",
      price: 10,
      images: ["/catalog/a.png", "https://example.com/existing.png"],
    },
  ];
  const result = rewriteCatalog(catalog, {
    "backend/public/catalog/a.png": {
      url: "https://res.cloudinary.com/test/a.png",
    },
  });
  assert.equal(result[0]._id, "same");
  assert.equal(result[0].price, 10);
  assert.equal(result[0].images[0], "https://res.cloudinary.com/test/a.png");
  assert.equal(result[0].images[1], catalog[0].images[1]);
  assert.equal(catalog[0].images[0], "/catalog/a.png");
  assert.throws(() => rewriteCatalog(catalog, {}), /Missing upload/);
});
test("upload service rejects insecure provider URLs without checkpointing failure", async () => {
  let saved = false;
  await assert.rejects(
    uploadBundledImages({
      images: [image("a.png", "hash")],
      manifest: { files: {} },
      upload: async () => ({ secure_url: "http://insecure.example/a" }),
      checkpoint: async () => {
        saved = true;
      },
    }),
    /secure URL/,
  );
  assert.equal(saved, false);
});
test("CLI dry run requires no credentials and leaves catalog/editorial mapping unchanged", () => {
  const files = [
    "backend/data/catalog.json",
    "frontend/src/data/cloudinary-images.json",
  ];
  const before = files.map((file) => readFileSync(root + file, "utf8"));
  const result = spawnSync(
    process.execPath,
    [root + "backend/scripts/upload-images.js", "--dry-run"],
    { cwd: "/tmp", encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Dry run: no network/);
  assert.deepEqual(
    files.map((file) => readFileSync(root + file, "utf8")),
    before,
  );
});
test("CLI prevents MongoDB synchronization in demo mode before any upload", () => {
  const result = spawnSync(
    process.execPath,
    [root + "backend/scripts/upload-images.js", "--sync-db"],
    {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        CLOUDINARY_NAME: "fake",
        CLOUDINARY_API_KEY: "fake",
        CLOUDINARY_SECRET_KEY: "fake",
        DEMO_MODE: "true",
      },
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No uploads started/);
});
