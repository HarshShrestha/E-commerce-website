import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";
cloudinary.config(env.cloudinary);
export { cloudinary };
