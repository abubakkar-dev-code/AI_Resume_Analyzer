import express from "express";
import {
  analyzeResume,
  extarctResume,
  getAllAnalysis,
  getAnalysisById,
  resumeUpload,
} from "../controller/resume_controller.js";
import upload from "../middleware/multer.js";
import { authenticate } from "../middleware/auth_middleware.js";

const router = express.Router();
router.post("/", authenticate, upload.single("file"), resumeUpload);
router.post("/:resumeId/extract", authenticate, extarctResume);
router.post("/:resumeId/analyze", authenticate, upload.none(), analyzeResume);
router.get("/analyses/history", authenticate, getAllAnalysis);
router.get("/analyses/:analyseId", authenticate, getAnalysisById);
export default router;
