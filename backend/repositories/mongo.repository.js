import mongoose from "mongoose";
import { models } from "../models/index.js";
export const mongoRepository = {
  async list(table, filter = {}) {
    return models[table].find(filter).lean();
  },
  async get(table, id) {
    return mongoose.isValidObjectId(id)
      ? models[table].findById(id).lean()
      : null;
  },
  async insert(table, data) {
    return (await models[table].create(data)).toObject();
  },
  async update(table, id, data) {
    return mongoose.isValidObjectId(id)
      ? models[table]
          .findByIdAndUpdate(id, { $set: data }, { new: true })
          .lean()
      : null;
  },
  async remove(table, id) {
    return mongoose.isValidObjectId(id)
      ? models[table].findByIdAndDelete(id).lean()
      : null;
  },
};
