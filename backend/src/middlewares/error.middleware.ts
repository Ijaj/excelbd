import { Request, Response, NextFunction } from "express";
// import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res
    .status(statusCode)
    .json({
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ message: "Not Found" });
};
