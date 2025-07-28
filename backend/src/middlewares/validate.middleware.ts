// validateMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { validationResult, FieldValidationError } from "express-validator";
import { ApiError } from "../utils/ApiError";

export const validateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors
      .array()
      .reduce((acc: { field: string; message: any }[], err) => {
        if (err.type === "field") {
          const fieldError = err as FieldValidationError;
          acc.push({
            field: fieldError.path,
            message: fieldError.msg,
          });
        }
        return acc;
      }, []);

    return next(new ApiError(400, "Validation Error", extracted));
  }
  next();
};
