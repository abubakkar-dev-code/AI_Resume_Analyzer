import dotenv from "dotenv";
dotenv.config();

const requiredvariables = [
  "PORT",
  "DATA_BASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_CLOUD_SECRET",
];

for (const variable of requiredvariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required env variables`);
  }
}
export const env = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.DATA_BASE_URL as string,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  cloud_api_key:process.env.CLOUDINARY_API_KEY,
  cloud_api_secret:process.env.CLOUDINARY_CLOUD_SECRET
};
