import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api_error.js";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not Found ${req.method},${req.url}`));
};

export default notFound;
