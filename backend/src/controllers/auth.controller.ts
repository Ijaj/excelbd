import { Request, Response, NextFunction } from "express";
import { register, login, deleteUser } from "../services/auth.service";
import {
  getTokenFromRequest,
  getUserFromToken,
} from "../utils/helpers";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await register(req.body);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await login(req.body);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      const user = await getUserFromToken(token);
      res.status(200).json({ user });
    }
  } catch (err) {
    next(err);
  }
};

export async function _delete(req: Request, res: Response, next: NextFunction) {
  const deleted = await deleteUser(req.user!._id);
  if (deleted === 1) {
    res.status(204).send();
  } else {
    res.status(204).json({ message: "The requested user was not found" });
  }
}
