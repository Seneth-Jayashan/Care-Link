import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_NAME,
    API_KEY: process.env.CLOUDINARY_KEY,
    API_SECRET: process.env.CLOUDINARY_SECRET,
  },
};
