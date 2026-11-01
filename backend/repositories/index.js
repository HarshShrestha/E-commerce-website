import { demo } from "../config/env.js";
import { createMemoryRepository } from "./memory.repository.js";
import { mongoRepository } from "./mongo.repository.js";
export const store = demo ? createMemoryRepository() : mongoRepository;
