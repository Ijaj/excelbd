import mongoose, { Schema } from "mongoose";
import { ParcelDocument } from "../types/parcel.types";
import { defaultEstimatedDate } from "../utils/constants";
import { generateParcelId, generateTrackingNumber } from "../utils/helpers";

const timelineSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: [
      "created",
      "pending",
      "picked-up",
      "in-transit",
      "delivered",
      "failed",
      "cancelled",
    ],
    default: "pending",
  },
  timestamp: { type: Number, required: true, default: Date.now },
  updatedBy: { type: String, required: false, default: null },
  note: { type: String, required: false, default: null },
});

const ParcelSchema = new Schema<ParcelDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => generateParcelId(),
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => generateTrackingNumber(),
  },
  status: { type: String, required: true, default: "pending" },
  timeline: [timelineSchema],
  priority: { type: String, required: true, default: "normal" },
  sender: {
    name: { type: String, required: true },
    company: { type: String, required: false, default: null },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  recipient: {
    name: { type: String, required: true },
    company: { type: String, required: false, default: null },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  packageDetails: {
    weight: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String, required: false, default: null },
    dimensions: { type: String, required: false, default: null },
  },
  dates: {
    created: {
      type: Date,
      required: true,
      default: Date.now,
      get: (v: { toISOString: () => any }) => v.toISOString(),
    },
    pickup: {
      type: Date,
      required: false,
      default: null,
      get: (v: { toISOString: () => any }) => v.toISOString(),
    },
    estimated: {
      type: Date,
      required: false,
      default: () => defaultEstimatedDate(),
      get: (v: { toISOString: () => any }) => v.toISOString(),
    },
  },
  assignedAgent: { type: String, required: false, default: null },
  cost: {
    type: Number,
    required: false,
    default: () => 10 + Math.floor(Math.random() * 500),
  },
  location: { type: String, required: false, default: null },
  paymentMethod: { type: String, required: true, default: "cod" },
  lastUpdatedBy: { type: String, required: false, default: null },
  lastStatusNote: { type: String, required: false, default: null },
});

ParcelSchema.pre("save", async function (next) {
  const parcel = this;
  if (parcel.isModified("status")) {
    const timelineEntry = {
      status: parcel.status,
      timestamp: Date.now(),
      updatedBy: parcel.assignedAgent || parcel.lastUpdatedBy || "system",
      note: parcel.lastStatusNote || "",
    };

    parcel.timeline.push(timelineEntry);
  }
  next();
});

export const ParcelModel = mongoose.model<ParcelDocument>(
  "Parcel",
  ParcelSchema
);
