import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
const base = "http://localhost:4010";
let child, token, admin, product, order;
const address = {
  firstName: "Test",
  lastName: "Shopper",
  email: "shopper@example.com",
  phone: "+1 202 555 0199",
  street: "123 Test Street",
  city: "Test City",
  state: "Test State",
  zipcode: "12345",
  country: "US",
};
async function call(path, { body, auth, method = "GET", key } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, ...(await response.json()) };
}
const post = (path, body, auth, key) =>
  call(path, { body, auth, key, method: "POST" });
before(async () => {
  child = spawn("node", ["server.js"], {
    cwd: new URL("../backend", import.meta.url),
    env: {
      ...process.env,
      PORT: "4010",
      DEMO_MODE: "true",
      NODE_ENV: "test",
      JWT_SECRET: "test-only-secret-with-at-least-32-characters",
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "test-admin-password",
    },
    stdio: "pipe",
  });
  let logs = "";
  child.stderr.on("data", (x) => {
    logs += x;
  });
  for (let i = 0; i < 100; i++) {
    try {
      if ((await call("/api/health")).success) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Test server did not start: " + logs);
});
after(() => child?.kill("SIGTERM"));
test("health identifies in-memory demo", async () => {
  assert.equal((await call("/api/health")).mode, "demo");
});
test("catalog exposes all 52 supplied products", async () => {
  const data = await call("/api/product/list");
  assert.equal(data.products.length, 52);
  product = data.products[0];
  assert.ok(product.images.length);
  assert.ok(product.sizes.length);
});
test("bundled product photo is served", async () => {
  const res = await fetch(base + product.images[0]);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /^image\//);
});
test("unknown product returns 404", async () => {
  assert.equal(
    (await post("/api/product/single", { productId: "missing" })).status,
    404,
  );
});
test("invalid registration is rejected", async () => {
  assert.equal(
    (
      await post("/api/user/register", {
        name: "A",
        email: "bad",
        password: "short",
      })
    ).status,
    400,
  );
});
test("register hashes password and returns scoped identity", async () => {
  const data = await post("/api/user/register", {
    name: "Test Shopper",
    email: address.email,
    password: "test-user-password",
  });
  assert.equal(data.status, 201);
  assert.ok(data.token);
  assert.equal(data.password, undefined);
  token = data.token;
});
test("duplicate registration returns 409", async () => {
  assert.equal(
    (
      await post("/api/user/register", {
        name: "Test Shopper",
        email: address.email,
        password: "test-user-password",
      })
    ).status,
    409,
  );
});
test("invalid login returns 401", async () => {
  assert.equal(
    (
      await post("/api/user/login", {
        email: address.email,
        password: "wrong-password",
      })
    ).status,
    401,
  );
});
test("correct login and profile work", async () => {
  const data = await post("/api/user/login", {
    email: address.email.toUpperCase(),
    password: "test-user-password",
  });
  assert.equal(data.status, 200);
  const me = await call("/api/user/me", { auth: data.token });
  assert.equal(me.user.name, "Test Shopper");
});
test("protected orders reject missing and tampered tokens", async () => {
  assert.equal((await call("/api/order/userorders")).status, 401);
  assert.equal(
    (await call("/api/order/userorders", { auth: token + "x" })).status,
    401,
  );
});
test("user cannot access admin routes", async () => {
  assert.equal((await call("/api/order/list", { auth: token })).status, 401);
  assert.equal(
    (await post("/api/product/remove", { id: product._id }, token)).status,
    401,
  );
});
test("admin sign in uses separate role", async () => {
  const data = await post("/api/user/admin", {
    email: "admin@example.com",
    password: "test-admin-password",
  });
  assert.equal(data.status, 200);
  admin = data.token;
  assert.equal(
    (await call("/api/order/userorders", { auth: admin })).status,
    401,
  );
});
const place = (body, key = randomUUID()) =>
  post(
    "/api/order/place",
    {
      address,
      items: [{ productId: product._id, size: product.sizes[0], quantity: 1 }],
      paymentMethod: "cod",
      ...body,
    },
    token,
    key,
  );
test("empty bag, bad size and invalid quantities are rejected", async () => {
  assert.equal((await place({ items: [] })).status, 400);
  for (const quantity of [-1, 0, 1.5, 100])
    assert.equal(
      (
        await place({
          items: [{ productId: product._id, size: "S", quantity }],
        })
      ).status,
      400,
    );
  assert.equal(
    (
      await place({
        items: [{ productId: product._id, size: "BAD", quantity: 1 }],
      })
    ).status,
    400,
  );
});
test("address validation and payment validation work", async () => {
  assert.equal(
    (await place({ address: { ...address, email: "bad" } })).status,
    400,
  );
  assert.equal((await place({ paymentMethod: "stripe" })).status, 400);
});
test("deleted/unavailable products cannot be ordered", async () => {
  assert.equal(
    (await place({ items: [{ productId: "missing", size: "S", quantity: 1 }] }))
      .status,
    409,
  );
});
test("server ignores tampered prices and computes shipping", async () => {
  const data = await place({
    amount: 0,
    shipping: 0,
    items: [
      { productId: product._id, size: product.sizes[0], quantity: 1, price: 0 },
    ],
  });
  assert.equal(data.status, 201);
  order = data.order;
  assert.equal(order.amount, product.price + 10);
  assert.equal(order.items[0].price, product.price);
});
test("free shipping applies at the threshold", async () => {
  const data = await place({
    items: [{ productId: product._id, size: product.sizes[0], quantity: 2 }],
  });
  assert.equal(data.order.shipping, 0);
  assert.equal(data.order.amount, product.price * 2);
});
test("checkout retries and concurrent submissions are idempotent", async () => {
  const key = randomUUID();
  const [a, b] = await Promise.all([place({}, key), place({}, key)]);
  assert.equal(a.order._id, b.order._id);
  const c = await place({}, key);
  assert.equal(c.order._id, a.order._id);
});
test("duplicate product/size lines are rejected", async () => {
  const line = { productId: product._id, size: product.sizes[0], quantity: 1 };
  assert.equal((await place({ items: [line, line] })).status, 400);
});
test("orders are user-scoped", async () => {
  const other = await post("/api/user/register", {
    name: "Other User",
    email: "other@example.com",
    password: "another-user-password",
  });
  assert.equal(
    (await call("/api/order/userorders", { auth: other.token })).orders.length,
    0,
  );
  assert.ok(
    (await call("/api/order/userorders", { auth: token })).orders.length > 0,
  );
});
test("admin status changes appear in customer history", async () => {
  assert.equal(
    (
      await post(
        "/api/order/status",
        { orderId: order._id, status: "Imaginary" },
        admin,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await post(
        "/api/order/status",
        { orderId: order._id, status: "Shipped" },
        token,
      )
    ).status,
    401,
  );
  assert.equal(
    (
      await post(
        "/api/order/status",
        { orderId: order._id, status: "Shipped" },
        admin,
      )
    ).status,
    200,
  );
  assert.equal(
    (await call("/api/order/userorders", { auth: token })).orders.find(
      (x) => x._id === order._id,
    ).status,
    "Shipped",
  );
});
test("newsletter validates and deduplicates submissions", async () => {
  assert.equal((await post("/api/newsletter", { email: "bad" })).status, 400);
  assert.equal(
    (await post("/api/newsletter", { email: "newsletter@example.com" })).status,
    200,
  );
  assert.equal(
    (await post("/api/newsletter", { email: "newsletter@example.com" })).status,
    200,
  );
});
test("admin removal preserves historical order snapshots", async () => {
  assert.equal(
    (await post("/api/product/remove", { id: product._id }, admin)).status,
    200,
  );
  assert.equal(
    (await post("/api/product/remove", { id: product._id }, admin)).status,
    404,
  );
  assert.equal(
    (await call("/api/order/userorders", { auth: token })).orders.find(
      (x) => x._id === order._id,
    ).items[0].name,
    product.name,
  );
});
test("unknown API route returns JSON 404", async () => {
  assert.equal((await call("/api/unknown")).status, 404);
});
