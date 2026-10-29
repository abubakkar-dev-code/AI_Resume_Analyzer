import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    env.jwt_secret as string,
    {
      expiresIn: env.jwt_expires_in,
    } as SignOptions,
  );
};

export default generateToken;
