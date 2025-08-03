"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoleById = exports.getUserById = void 0;
exports.getAllAgentsService = getAllAgentsService;
exports.getAllAvailableAgentsService = getAllAvailableAgentsService;
exports.assignAgentToParcel = assignAgentToParcel;
exports.getAllCustomersService = getAllCustomersService;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const getUserById = async (id) => {
    if ((0, mongoose_1.isValidObjectId)(id)) {
        return await user_model_1.User.findById(id).select("-password");
    }
};
exports.getUserById = getUserById;
const getUserRoleById = async (userId) => {
    const user = await user_model_1.User.findById(userId).select("role");
    return user ? user.role : null;
};
exports.getUserRoleById = getUserRoleById;
async function getAllAgentsService(id = null) {
    if (id) {
        return await user_model_1.User.findOne({ _id: id, role: "agent" })
            .select("-password")
            .populate("parcels");
    }
    else
        return await user_model_1.User.find({ role: "agent" })
            .select("-password")
            .populate("parcels");
}
async function getAllAvailableAgentsService() {
    // return all users with role = 'agent' and currentParcels < maxCapacity
    const maxCapacity = 10;
    return await user_model_1.User.find({
        role: "agent",
        status: "available",
        currentParcels: { $lt: maxCapacity },
    })
        .select("-password")
        .populate("parcels");
}
async function assignAgentToParcel(parcelId, agentId) {
    if (!(0, mongoose_1.isValidObjectId)(parcelId) || !(0, mongoose_1.isValidObjectId)(agentId)) {
        throw new Error("Invalid parcel or agent ID");
    }
    await user_model_1.User.updateOne({ _id: agentId, role: "agent" }, { $push: { parcels: parcelId } });
}
async function getAllCustomersService() {
    return await user_model_1.User.find({ role: "customer" }).select("-password");
}
