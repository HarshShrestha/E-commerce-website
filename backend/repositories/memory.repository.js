import { randomUUID } from "node:crypto";
import catalog from "../data/catalog.json" with { type: "json" };
export function createMemoryRepository() {
  const memory = {
    products: structuredClone(catalog),
    users: [],
    orders: [],
    subscriptions: [],
  };
  return {
    async list(table, filter = {}) {
      return structuredClone(
        memory[table].filter((row) =>
          Object.entries(filter).every(([key, value]) => row[key] === value),
        ),
      );
    },
    async get(table, id) {
      return structuredClone(
        memory[table].find((row) => row._id === id) || null,
      );
    },
    async insert(table, data) {
      const duplicate =
        table === "orders"
          ? memory.orders.some(
              (row) =>
                row.userId === data.userId &&
                row.requestKey === data.requestKey,
            )
          : ["users", "subscriptions"].includes(table) &&
            memory[table].some((row) => row.email === data.email);
      if (duplicate)
        throw Object.assign(new Error("Duplicate record"), { code: 11000 });
      const row = { ...structuredClone(data), _id: randomUUID() };
      memory[table].push(row);
      return structuredClone(row);
    },
    async update(table, id, data) {
      const row = memory[table].find((row) => row._id === id);
      if (!row) return null;
      Object.assign(row, data);
      return structuredClone(row);
    },
    async remove(table, id) {
      const index = memory[table].findIndex((row) => row._id === id);
      return index < 0 ? null : memory[table].splice(index, 1)[0];
    },
  };
}
