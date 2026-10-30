import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api_error.js";
import Resume from "../models/resumeModel.js";
import ApiResponse from "../utils/api_response.js";
import mongoose from "mongoose";
import textExtractor from "../utils/textExtractor.js";
import axios from "axios";
import { env } from "node:process";
import { analyzeResumeWithAI } from "../utils/resuemAnalyzer.js";
import Analysis from "../models/analysisModel.js";

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
      file: req.file?.path,
      status: "uploaded",
    });
    return res
      .status(200)
      .json(new ApiResponse("file uploaded successfully", uploadedFile));
  } catch (error) {
    next(error);
  }
};
export const extarctResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { resumeId } = req.params;

    if (!userId) {
      throw new ApiError(401, "Please login to analyze your resume");
    }

    if (!resumeId || !mongoose.isValidObjectId(resumeId)) {
      throw new ApiError(400, "Invalid resume ID");
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
    });

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    if (!resume.file) {
      throw new ApiError(400, "Resume file URL not found");
    }

    if (resume.status === "processing") {
      throw new ApiError(409, "Resume is already being processed");
    }

    resume.status = "processing";
    await resume.save();

    try {
      const response = await axios.get<ArrayBuffer>(resume.file, {
        responseType: "arraybuffer",
        timeout: 30000,
        maxContentLength: 5 * 1024 * 1024,
      });

      const fileBuffer = Buffer.from(response.data);

      const extension = resume.originalFileName
        ?.split(".")
        .pop()
        ?.toLowerCase();

      if (!extension || !["pdf", "docx"].includes(extension)) {
        throw new ApiError(
          400,
          "Currently, only PDF and DOCX extraction is supported",
        );
      }

      const extractedText = await textExtractor(fileBuffer, extension);

      if (!extractedText.trim()) {
        throw new ApiError(422, "No readable text found in this resume");
      }
      resume.extractedText = extractedText;
      resume.status = "processed";
      await resume.save();

      return res.status(200).json(
        new ApiResponse("Resume text extracted successfully", {
          resumeId: resume._id,
          title: resume.title,
          status: resume.status,
          extractedText,
        }),
      );
    } catch (error) {
      resume.status = "failed";
      await resume.save();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
export const analyzeResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const resumeId = req?.params.resumeId as string;
    const { targetRole } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized,please Login to access");
    }
    if (!targetRole || targetRole === "") {
      throw new ApiError(400, "Please provide target role to analyze");
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      throw new ApiError(404, "Resume not Found");
    }
    const resumeText = resume?.extractedText;
    if (!resumeText || resumeText === "") {
      throw new ApiError(
        404,
        "Resume Text not found,please upload the file properly",
      );
    }
    const result = await analyzeResumeWithAI({ resumeText, targetRole });
    const analyzedResult = await Analysis.create({
      userId,
      resumeId,
      targetRole,
      aiResults: result,
    });
    return res
      .status(201)
      .json(new ApiResponse("resume analysed successfully", analyzedResult));
  } catch (error) {
    next(error);
  }
};
export const getAllAnalysis = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized,please login to access");
    }
    const analyses = await Analysis.find({ userId })
      .populate({
        path: "resumeId",
        select: "title originalFileName",
      })
      .sort({ createdAt: -1 })
      .lean();
    if (!analyses) {
      throw new ApiError(400, "No records found");
    }
    return res
      .status(200)
      .json(new ApiResponse("Analysis history fetched successfully", analyses));
  } catch (error) {
    next(error);
  }
};
export const getAnalysisById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { analyseId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized please login to access");
    }
    const analyses = await Analysis.findOne({
      _id: analyseId,
      userId,
    }).populate({ path: "resumeId", select: "title originalFileName" });
    if (!analyses) {
      throw new ApiError(404, "No records Found");
    }
    return res
      .status(200)
      .json(new ApiResponse("analyses fetched successfully", analyses));
  } catch (error) {
    next(error);
  }
};
