import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary-v2";
const uploadParams = {
  folder: "resumes",
  resource_type: "raw",
  type:"upload"
};
const storage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: uploadParams as any,
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  const allowedMimetype = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedMimetype.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only PDF, Word, and DOCX files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});
export default upload;
