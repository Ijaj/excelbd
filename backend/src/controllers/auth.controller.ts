import { Request, Response, NextFunction } from "express";
import { register, login, deleteUser } from "../services/auth.service";
import { getTokenFromRequest, getUserFromToken } from "../utils/helpers";
import { ApiError } from "../utils/ApiError";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, ...rest } = req.body;
    const fullName = `${firstName} ${lastName}`.trim();
    const userData = { ...rest, name: fullName };
    if (userData.password !== userData.confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }
    delete userData.confirmPassword;
    const token = await register(userData);
    res.status(201).send();
  } catch (err) {
    next(
      new ApiError(400, "Registration failed", [
        { field: "email", message: "Email already exists" },
      ])
    );
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [token, user] = await login(req.body);
    res.status(200).json({ user, token });
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
  try {
    const deleted = await deleteUser(req.user!._id);
    if (deleted === 1) {
      res.status(204).send();
    } else {
      // res.status(404).json({ message: "The requested user was not found" });
      next(new ApiError(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
}
