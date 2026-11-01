import uploadedImages from "../data/cloudinary-images.json";
import localHero from "../assets/hero_img.png";
import localAbout from "../assets/about_img.png";
export const heroImage = uploadedImages["hero_img.png"] || localHero;
export const aboutImage = uploadedImages["about_img.png"] || localAbout;

export const uploadedImage = (name, fallback) =>
  uploadedImages[name] || fallback;
