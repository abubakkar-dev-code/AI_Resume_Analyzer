import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api_error.js";

const errorMiddleware = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error details:", error);
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: `Internal server error ${error.message}`,
  });
};

export default errorMiddleware;
