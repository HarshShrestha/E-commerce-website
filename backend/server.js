import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./db/connect.js";
await connectDB();
const server = app.listen(env.port, () =>
  console.log("API listening on " + env.port),
);
function shutdown() {
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
