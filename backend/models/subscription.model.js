import mongoose from "mongoose";
const schema = new mongoose.Schema({
  email: { type: String, unique: true },
  date: Number,
});
export default mongoose.models.subscriptions ||
  mongoose.model("subscriptions", schema);
