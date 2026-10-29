import express from "express";
import { resumeUpload } from "../controller/resume_controller.js";
import upload from "../middleware/multer.js";
import { authenticate } from "../middleware/auth_middleware.js";

const router = express.Router();
router.post("/", authenticate, upload.single("file"), resumeUpload);

export default router;
