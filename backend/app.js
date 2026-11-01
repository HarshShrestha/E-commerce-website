import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { securityHeaders } from "./middlewares/security.middleware.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: (origin, done) =>
      done(null, !origin || env.corsOrigins.includes(origin)),
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(securityHeaders);
app.use(
  "/catalog",
  express.static(fileURLToPath(new URL("./public/catalog", import.meta.url)), {
    maxAge: "1d",
  }),
);
app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
