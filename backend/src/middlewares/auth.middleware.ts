import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { getUserFromToken } from "../utils/helpers";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authorization token missing"));
  }
  try {
    const token = authHeader.split(" ")[1];
    const user = await getUserFromToken(token);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(
      err instanceof ApiError
        ? err
        : new ApiError(401, "Invalid or expired token")
    );
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }
  try {
    const token = authHeader.split(" ")[1];
    const user = await getUserFromToken(token);

    if (!user) {
      req.user = null;
    }

    req.user = user;
    next();
  } catch (err) {
    req.user = null; // If token is invalid, set user to null
    next();
  }
};
