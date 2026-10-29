import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api_error.js";
import Resume from "../models/resumeModel.js";
import ApiResponse from "../utils/api_response.js";

export const resumeUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { title } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      throw new ApiError(400, "Please provide title in proper format");
    }
    if (!userId) {
      throw new ApiError(401, "Unauthorized,please login to upload");
    }
    if (!req.file) {
      throw new ApiError(400, "please upload the files");
    }
    const uploadedFile = await Resume.create({
      userId,
      title,
      originalFileName: req.file?.originalname,
      publicId: req.file.filename,
      status: "uploaded",
    });
    return res
      .status(200)
      .json(new ApiResponse("file uploaded successfully", uploadedFile));
  } catch (error) {
    next(error);
  }
};
