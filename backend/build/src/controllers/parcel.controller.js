"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteParcel = exports.updateParcel = exports.getParcelByTrackingNumber = exports.getParcelsByUser = exports.getParcelsByAgent = exports.getAllParcels = exports.addParcel = void 0;
const socket_service_1 = require("../services/socket.service");
const ApiError_1 = require("../utils/ApiError");
const parcel_service_1 = require("../services/parcel.service");
const constants_1 = require("../utils/constants");
const user_service_1 = require("../services/user.service");
const email_service_1 = require("../services/email.service");
function emitAllParcelsUpdate() {
    (0, parcel_service_1.getAllParcels)()
        .then((parcels) => {
        socket_service_1.socketService.emitEvent("allParcels", parcels);
    })
        .catch((err) => {
        console.error("Failed to emit all parcels update:", err);
    });
}
// Add new parcel
const addParcel = async (req, res) => {
    const parcelData = req.body;
    const user = req.user;
    if (user && user.role === "customer") {
        const company = parcelData.sender?.company || null;
        parcelData.sender = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            company: company,
        };
    }
    parcelData.timeline = [
        {
            status: "created",
            timestamp: Date.now(),
            updatedBy: user ? user._id.toString() : "system",
        },
        {
            status: "pending",
            timestamp: Date.now(),
            updatedBy: user ? user._id.toString() : "system",
        },
    ];
    try {
        const newParcel = await (0, parcel_service_1.createParcel)(parcelData);
        // add the new parcel to the user's parcels array
        if (user && user.role === "customer") {
            user.parcels.push(newParcel._id.toString());
            await user.save();
        }
        emitAllParcelsUpdate();
        res.status(201).json(newParcel);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create parcel", error: err });
    }
};
exports.addParcel = addParcel;
// Get all parcels
const getAllParcels = async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        if (user.role === "admin") {
            const parcels = await (0, parcel_service_1.getAllParcels)();
            res.json(parcels);
        }
        else {
            res.status(403).json({ error: "Access denied" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch parcels" });
    }
};
exports.getAllParcels = getAllParcels;
// Get all parcels assigned to an agent
const getParcelsByAgent = async (req, res) => {
    const user = req.user;
    if (!user || user.role === "customer") {
        throw new ApiError_1.ApiError(403, "Access denied");
    }
    const agentId = req.params.agentId;
    if (!agentId) {
        throw new ApiError_1.ApiError(400, "Agent ID is required");
    }
    try {
        const parcels = await (0, parcel_service_1.getParcelsByAgent)(agentId);
        res.json(parcels);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch agent's parcels" });
    }
};
exports.getParcelsByAgent = getParcelsByAgent;
// Get all parcels for a specific user (by email)
const getParcelsByUser = async (req, res) => {
    const user = req.user;
    if (user &&
        (user.role === "admin" ||
            (user.role === "customer" && user.email === req.params.email))) {
        const { email } = req.params;
        try {
            // const parcels = await getParcelsByUserService(email);
            await user.populate("parcels");
            console.log("User's parcels:", user.parcels);
            res.status(200).json(user.parcels);
        }
        catch (err) {
            res.status(500).json({ error: "Failed to fetch user's parcels" });
        }
    }
    else {
        res.status(403).json({ error: "Access denied" });
    }
};
exports.getParcelsByUser = getParcelsByUser;
// Get all info of a specific parcel (by trackingNumber)
const getParcelByTrackingNumber = async (req, res) => {
    const { trackingNumber } = req.params;
    try {
        const parcel = await (0, parcel_service_1.getParcelByTrackingNumber)(trackingNumber);
        if (!parcel)
            return res.status(404).json({ error: "Parcel not found" });
        res.json(parcel);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch parcel" });
    }
};
exports.getParcelByTrackingNumber = getParcelByTrackingNumber;
// Update parcel info (status, assignedAgent, pickup, estimated, priority)
const updateParcel = async (req, res) => {
    const user = req.user;
    const { trackingNumber } = req.params;
    const { status, assignedAgent, estimated, priority, note } = req.body;
    const parcel = await (0, parcel_service_1.getParcelByTrackingNumber)(trackingNumber);
    if (!parcel) {
        throw new ApiError_1.ApiError(404, "Parcel not found", [
            { field: "param.trackingNumber", message: "Invalid Parcel ID" },
        ]);
    }
    /** 🔹 1. Set lastUpdatedBy and lastStatusNote if user exists */
    const update = {
        lastUpdatedBy: user ? user._id.toString() : "guest",
    };
    if (note)
        update.lastStatusNote = note;
    /** 🔹 2. Agent can be assigned while status is 'pending'.
     * Status cannot change to anything except 'cancelled' without an agent */
    if (status &&
        status !== "pending" &&
        status !== "cancelled" &&
        !assignedAgent &&
        !parcel.assignedAgent) {
        throw new ApiError_1.ApiError(400, "Cannot change status unless an agent is assigned (except cancelling).");
    }
    /** 🔹 3. Prevent un-assigning agent if status = 'in-transit' */
    if (parcel.assignedAgent &&
        !assignedAgent &&
        parcel.status === "in-transit") {
        throw new ApiError_1.ApiError(400, "Cannot un-assign agent while the parcel is in-transit.");
    }
    /** 🔹 4. Validate assignedAgent role and max capacity */
    let newAgent = null;
    if (assignedAgent) {
        if (user.role !== "admin") {
            throw new ApiError_1.ApiError(403, "Only admins can assign agents.");
        }
        const role = await (0, user_service_1.getUserRoleById)(assignedAgent);
        if (role !== "agent") {
            throw new ApiError_1.ApiError(400, "Assigned agent must be a valid agent");
        }
        newAgent = await (0, user_service_1.getUserById)(assignedAgent);
        if (!newAgent)
            throw new ApiError_1.ApiError(404, "Agent not found");
        if (newAgent.currentParcels >= newAgent.maxCapacity) {
            throw new ApiError_1.ApiError(400, "This agent has reached their maximum parcel capacity.");
        }
        update.assignedAgent = assignedAgent;
    }
    /** 🔹 5. Handle status updates */
    if (status) {
        update.status = status;
        // If picked-up, set pickup date and estimated date if not provided
        if (status === "picked-up") {
            update["dates.pickup"] = new Date();
            update["dates.estimated"] = estimated ?? (0, constants_1.defaultEstimatedDate)();
        }
        // If failed or delivered, decrement agent's currentParcels
        if ((status === "failed" ||
            status === "delivered" ||
            status === "cancelled") &&
            parcel.assignedAgent) {
            const agent = await (0, user_service_1.getUserById)(parcel.assignedAgent);
            if (agent && agent.currentParcels > 0) {
                agent.currentParcels -= 1;
                await agent.save();
            }
        }
    }
    /** 🔹 6. Update priority if provided */
    if (priority)
        update.priority = priority;
    /** 🔹 7. Update estimated date manually if provided */
    if (estimated && status !== "picked-up") {
        update["dates.estimated"] = estimated;
    }
    /** 🔹 Perform the update */
    try {
        const updatedParcel = await (0, parcel_service_1.updateParcelByTrackingNumber)(trackingNumber, update);
        if (!updatedParcel) {
            return res.status(404).json({ error: "Parcel not found" });
        }
        // Send email notification when status changes
        if (status) {
            try {
                await (0, email_service_1.sendParcelNotification)(updatedParcel);
            }
            catch (emailError) {
                console.error("Failed to send email notification:", emailError);
                // Don't throw error, continue with the response
            }
        }
        /** 🔹 8. If agent is newly assigned and status = picked-up, add parcel to agent's array */
        if (newAgent && status === "picked-up") {
            if (!newAgent.parcels.includes(updatedParcel._id.toString())) {
                newAgent.parcels.push(updatedParcel._id.toString());
                newAgent.currentParcels += 1;
                await newAgent.save();
            }
        }
        emitAllParcelsUpdate();
        res.json(updatedParcel);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update parcel" });
    }
};
exports.updateParcel = updateParcel;
const deleteParcel = async (req, res) => {
    const user = req.user;
    const trk = req.body;
    if (!user || user.role !== "admin") {
        res.status(403).json({ error: "Access denied" });
        return;
    }
    if (!trk || (Array.isArray(trk) && trk.length === 0)) {
        res.status(400).json({ error: "Tracking number is required" });
        return;
    }
    try {
        const deletedParcel = await (0, parcel_service_1.deleteManyParcelsByTrackingNumber)(trk);
        if (!deletedParcel) {
            res.status(404).json({ error: "Parcel not found" });
        }
        emitAllParcelsUpdate();
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete parcel" });
    }
};
exports.deleteParcel = deleteParcel;
