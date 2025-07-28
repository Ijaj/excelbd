import mongoose from "mongoose";
import { UserDocument } from "../types/user.types";
import "./task.model";

const userSchema = new mongoose.Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

export const User = mongoose.model<UserDocument>("User", userSchema);
