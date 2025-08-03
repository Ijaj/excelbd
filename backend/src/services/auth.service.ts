import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

export const register = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newData = { ...userData, password: hashedPassword };
  const user = await User.create(newData);
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });
};

export const login = async ({ email, password }: any) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new ApiError(401, "Invalid Email", [
      { field: "email", message: "Invalid Email" },
    ]);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new ApiError(401, "Invalid Passowrd", [
      { field: "password", message: "Invalid Password" },
    ]);

  // Remove password before returning user
  const { password: _password, ...userObj } = user.toObject();

  return [
    jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    }),
    userObj,
  ];
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    throw new ApiError(498, "Invalid token");
  }
};

export const deleteUser = async (id: string) => {
  const d = await User.deleteOne({ _id: id });
  return d.deletedCount;
};
