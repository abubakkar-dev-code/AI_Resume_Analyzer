import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  api_key: env.cloud_api_key!,
  api_secret: env.cloud_api_secret!,
  cloud_name: env.cloud_name!,
});

export default cloudinary;
