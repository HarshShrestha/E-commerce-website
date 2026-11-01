import { connectDB, disconnectDB } from "../db/connect.js";
import { seedCatalog } from "../services/catalog.service.js";
try {
  await connectDB();
  await seedCatalog();
  console.log("Catalog seeded.");
} finally {
  await disconnectDB();
}
