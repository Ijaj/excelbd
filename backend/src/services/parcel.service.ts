import { ParcelModel } from "../models/parcel.model";
import { ParcelDocument } from "../types/parcel.types";

export const createParcel = async (parcelData: any) => {
  const newParcel = new ParcelModel(parcelData);
  return await newParcel.save();
};

export const getAllParcels = async () => {
  return await ParcelModel.find();
};

export const getParcelsByAgent = async (agentId: string) => {
  return await ParcelModel.find({ assignedAgent: agentId });
};

export const getActiveParcelsByAgent = async (agentId: string) => {
  return await ParcelModel.find({
    assignedAgent: agentId,
    status: { $ne: "delivered" },
  });
};

export const getParcelsByUser = async (email: string) => {
  return await ParcelModel.find({ "sender.email": email });
};

export const getActiveParcelsByUser = async (email: string) => {
  return await ParcelModel.find({
    "sender.email": email,
    status: { $ne: "delivered" },
  });
};

export const getParcelByTrackingNumber = async (trackingNumber: string) => {
  if (!trackingNumber) return null;
  if (typeof trackingNumber !== "string") {
    throw new Error("Tracking number must be a string");
  }
  return await ParcelModel.findOne({ trackingNumber })
    .populate("assignedAgent")
    .populate("timeline");
};

export const updateParcelByTrackingNumber = async (
  trackingNumber: string,
  update: Partial<ParcelDocument>
) => {
  const parcel = await ParcelModel.findOne({ trackingNumber });
  if (!parcel) return null;

  Object.assign(parcel, update);
  return await parcel.save();
};

export const deleteParcelByTrackingNumber = async (trackingNumber: string) => {
  return await ParcelModel.findOneAndDelete({ trackingNumber });
};

export const deleteManyParcelsByTrackingNumber = async (
  trackingNumber: string[]
) => {
  return await ParcelModel.deleteMany({ trackingNumber });
};
