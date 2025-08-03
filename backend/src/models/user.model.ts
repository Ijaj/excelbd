import mongoose from "mongoose";
import { UserDocument } from "../types/user.types";

const userSchema = new mongoose.Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "agent", "customer"],
    default: "customer",
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "busy"],
    default: "available",
  },
  currentParcels: { type: Number, required: true, default: 0 },
  maxCapacity: { type: Number, required: true, default: 10 },

  parcels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
    },
  ],
});

export const User = mongoose.model<UserDocument>("User", userSchema);
