import { Request, Response, NextFunction } from "express";

// Usage: restrictTo("admin", "agent")
export function allowOnly(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Assumes req.user is populated by authentication middleware

    if (!user || !allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions." });
    }

    next();
  };
}
