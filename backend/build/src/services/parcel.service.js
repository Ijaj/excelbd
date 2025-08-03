"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyParcelsByTrackingNumber = exports.deleteParcelByTrackingNumber = exports.updateParcelByTrackingNumber = exports.getParcelByTrackingNumber = exports.getActiveParcelsByUser = exports.getParcelsByUser = exports.getActiveParcelsByAgent = exports.getParcelsByAgent = exports.getAllParcels = exports.createParcel = void 0;
const parcel_model_1 = require("../models/parcel.model");
const createParcel = async (parcelData) => {
    const newParcel = new parcel_model_1.ParcelModel(parcelData);
    return await newParcel.save();
};
exports.createParcel = createParcel;
const getAllParcels = async () => {
    return await parcel_model_1.ParcelModel.find();
};
exports.getAllParcels = getAllParcels;
const getParcelsByAgent = async (agentId) => {
    return await parcel_model_1.ParcelModel.find({ assignedAgent: agentId });
};
exports.getParcelsByAgent = getParcelsByAgent;
const getActiveParcelsByAgent = async (agentId) => {
    return await parcel_model_1.ParcelModel.find({
        assignedAgent: agentId,
        status: { $ne: "delivered" },
    });
};
exports.getActiveParcelsByAgent = getActiveParcelsByAgent;
const getParcelsByUser = async (email) => {
    return await parcel_model_1.ParcelModel.find({ "sender.email": email });
};
exports.getParcelsByUser = getParcelsByUser;
const getActiveParcelsByUser = async (email) => {
    return await parcel_model_1.ParcelModel.find({
        "sender.email": email,
        status: { $ne: "delivered" },
    });
};
exports.getActiveParcelsByUser = getActiveParcelsByUser;
const getParcelByTrackingNumber = async (trackingNumber) => {
    if (!trackingNumber)
        return null;
    if (typeof trackingNumber !== "string") {
        throw new Error("Tracking number must be a string");
    }
    return await parcel_model_1.ParcelModel.findOne({ trackingNumber })
        .populate("assignedAgent")
        .populate("timeline");
};
exports.getParcelByTrackingNumber = getParcelByTrackingNumber;
const updateParcelByTrackingNumber = async (trackingNumber, update) => {
    const parcel = await parcel_model_1.ParcelModel.findOne({ trackingNumber });
    if (!parcel)
        return null;
    Object.assign(parcel, update);
    return await parcel.save();
};
exports.updateParcelByTrackingNumber = updateParcelByTrackingNumber;
const deleteParcelByTrackingNumber = async (trackingNumber) => {
    return await parcel_model_1.ParcelModel.findOneAndDelete({ trackingNumber });
};
exports.deleteParcelByTrackingNumber = deleteParcelByTrackingNumber;
const deleteManyParcelsByTrackingNumber = async (trackingNumber) => {
    return await parcel_model_1.ParcelModel.deleteMany({ trackingNumber });
};
exports.deleteManyParcelsByTrackingNumber = deleteManyParcelsByTrackingNumber;
