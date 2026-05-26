import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Connect DB and Cloudinary
connectDB();
connectCloudinary();

//  Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Routes
app.use("/api/user", userRouter);
app.use("/api/product",productRouter);

app.post("/test", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
