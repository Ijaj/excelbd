"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = exports.getUserFromToken = exports.getTokenFromRequest = void 0;
exports.generateTrackingNumber = generateTrackingNumber;
exports.generateParcelId = generateParcelId;
const crypto_1 = __importDefault(require("crypto"));
const auth_service_1 = require("../services/auth.service");
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("./ApiError");
const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError_1.ApiError(401, "Authorization token missing");
    }
    return authHeader.split(" ")[1];
};
exports.getTokenFromRequest = getTokenFromRequest;
const getUserFromToken = async (token) => {
    try {
        const id = (0, exports.getUserIdFromToken)(token);
        const user = await user_model_1.User.findById(id).select("-password");
        if (!user)
            throw new ApiError_1.ApiError(404, "User not found");
        return user;
    }
    catch (error) {
        throw new ApiError_1.ApiError(498, "Invalid or expired token");
    }
};
exports.getUserFromToken = getUserFromToken;
const getUserIdFromToken = (token) => {
    try {
        const decoded = (0, auth_service_1.verifyToken)(token);
        return decoded.id;
    }
    catch (error) {
        throw new ApiError_1.ApiError(498, "Invalid token");
    }
};
exports.getUserIdFromToken = getUserIdFromToken;
function generateTrackingNumber() {
    const timestamp = Date.now();
    const randomHex = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
    return `TRK-${timestamp}-${randomHex}`;
}
function generateParcelId() {
    const ts = Date.now().toString().slice(-5);
    const rand = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `BK${ts}${rand}`;
}
