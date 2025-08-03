import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model";

export const getUserById = async (id: string) => {
  if (isValidObjectId(id)) {
    return await User.findById(id).select("-password");
  }
};

export const getUserRoleById = async (
  userId: string
): Promise<string | null> => {
  const user = await User.findById(userId).select("role");
  return user ? user.role : null;
};

export async function getAllAgentsService(id: string | null = null) {
  if (id) {
    return await User.findOne({ _id: id, role: "agent" })
      .select("-password")
      .populate("parcels");
  } else
    return await User.find({ role: "agent" })
      .select("-password")
      .populate("parcels");
}

export async function getAllAvailableAgentsService() {
  // return all users with role = 'agent' and currentParcels < maxCapacity
  const maxCapacity = 10;
  return await User.find({
    role: "agent",
    status: "available",
    currentParcels: { $lt: maxCapacity },
  })
    .select("-password")
    .populate("parcels");
}

export async function assignAgentToParcel(
  parcelId: string,
  agentId: string
): Promise<void> {
  if (!isValidObjectId(parcelId) || !isValidObjectId(agentId)) {
    throw new Error("Invalid parcel or agent ID");
  }
  await User.updateOne(
    { _id: agentId, role: "agent" },
    { $push: { parcels: parcelId } }
  );
}

export async function getAllCustomersService() {
  return await User.find({ role: "customer" }).select("-password");
}
