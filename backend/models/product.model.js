import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  subCategory: String,
  sizes: [String],
  bestSeller: Boolean,
  date: Number,
});
export default mongoose.models.products || mongoose.model("products", schema);
