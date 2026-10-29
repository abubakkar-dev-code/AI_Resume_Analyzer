import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api_error.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}
export interface jwtPayload {
  userId: string;
}
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new ApiError(401, "Un authorized,please login to access");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new ApiError(404, "token not found");
    }
    const decoded = jwt.verify(token, env.jwt_secret!) as jwtPayload;
    req.user=decoded
    next()
  } catch (error) {
    next(error);
  }
};
