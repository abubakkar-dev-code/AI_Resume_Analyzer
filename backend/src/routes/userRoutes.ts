import express from "express";
import { registerUser, loginUser, getProfile } from "../controller/userController.js";
import { authenticate } from "../middleware/auth_middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",authenticate,getProfile);

export default router;
