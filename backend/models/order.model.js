import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: String,
  items: [mongoose.Schema.Types.Mixed],
  address: mongoose.Schema.Types.Mixed,
  amount: Number,
  shipping: Number,
  status: String,
  paymentMethod: String,
  payment: Boolean,
  date: Number,
  requestKey: String,
});
schema.index({ userId: 1, requestKey: 1 }, { unique: true });
export default mongoose.models.orders || mongoose.model("orders", schema);
