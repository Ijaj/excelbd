import { Request } from "express";
import { verifyToken } from "../services/auth.service";
import { User } from "../models/user.model";
import { ApiError } from "./ApiError";

export const getTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing");
  }
  return authHeader.split(" ")[1];
};

export const getUserFromToken = async (token: string) => {
  try {
    const id = getUserIdFromToken(token);
    const user = await User.findById(id).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    return user;
  } catch (error) {
    throw new ApiError(498, "Invalid or expired token");
  }
};

export const getUserIdFromToken = (token: string) => {
  try {
    const decoded = verifyToken(token) as { id: string };
    return decoded.id;
  } catch (error) {
    throw new ApiError(498, "Invalid token");
  }
};
