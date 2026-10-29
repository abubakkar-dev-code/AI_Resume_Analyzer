import type { Response, NextFunction, Request } from "express";
import ApiError from "../utils/api_error.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import ApiResponse from "../utils/api_response.js";
import generateToken from "../utils/jwt.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ApiError(400, "Please required fields to create the user");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exist,Try to Login");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json(new ApiResponse("User registered successfully", user));
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Please provide the required fields");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new ApiError(404, "Usernot Found");
    }
    const ispassword = await bcrypt.compare(password, existingUser.password);
    if (!ispassword) {
      throw new ApiError(401, "Invalid credentials");
    }
    const token = generateToken(existingUser._id.toString());
    return res.status(200).json(
      new ApiResponse("Login successfully", {
        existingUser,
        token,
      }),
    );
  } catch (error) {
    next(error);
  }
};
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    const userDetails = await User.findOne({ _id: userId, isActive: true })
      .select("-password")
      .lean();
    if (!userDetails) {
      throw new ApiError(404, "user not found");
    }
    return res
      .status(200)
      .json(new ApiResponse("User details fetched successfully", userDetails));
  } catch (error) {
    next(error);
  }
};
