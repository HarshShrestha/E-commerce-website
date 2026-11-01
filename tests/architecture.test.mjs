import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
const root = new URL("../", import.meta.url).pathname;
test("backend has explicit responsibility boundaries", () => {
  for (const dir of [
    "controllers",
    "routes",
    "models",
    "constants",
    "db",
    "utils",
    "middlewares",
    "services",
    "repositories",
    "config",
  ])
    assert.ok(existsSync(path.join(root, "backend", dir)), dir);
});
test("backend executable only starts and stops the application", () => {
  const server = readFileSync(path.join(root, "backend/server.js"), "utf8");
  assert.ok(server.split("\n").length <= 80);
  assert.doesNotMatch(server, /app\.(get|post|put|delete)\(/);
  assert.doesNotMatch(server, /new mongoose\.Schema|bcrypt|jsonwebtoken/);
});
test("React entry points are composition, not feature implementations", () => {
  for (const app of ["frontend", "admin"]) {
    const source = readFileSync(path.join(root, app, "src/App.jsx"), "utf8");
    assert.ok(source.split("\n").length <= 80, app);
    assert.doesNotMatch(source, /fetch\(|axios\.|localStorage\./);
    for (const dir of [
      "components",
      "hooks",
      "pages",
      "services",
      "layouts",
      "utils",
    ])
      assert.ok(existsSync(path.join(root, app, "src", dir)), app + "/" + dir);
  }
});
test("backend routes delegate to named controllers", () => {
  for (const name of readdirSync(path.join(root, "backend/routes")).filter(
    (x) => x.endsWith(".routes.js"),
  )) {
    const source = readFileSync(
      path.join(root, "backend/routes", name),
      "utf8",
    );
    assert.match(source, /controllers\//);
    assert.doesNotMatch(source, /res\.json|await store\./);
  }
});
