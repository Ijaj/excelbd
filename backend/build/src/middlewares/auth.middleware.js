"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const helpers_1 = require("../utils/helpers");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError_1.ApiError(401, "Authorization token missing"));
    }
    try {
        const token = authHeader.split(" ")[1];
        const user = await (0, helpers_1.getUserFromToken)(token);
        if (!user) {
            return next(new ApiError_1.ApiError(401, "User not found"));
        }
        req.user = user;
        next();
    }
    catch (err) {
        return next(err instanceof ApiError_1.ApiError
            ? err
            : new ApiError_1.ApiError(401, "Invalid or expired token"));
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }
    try {
        const token = authHeader.split(" ")[1];
        const user = await (0, helpers_1.getUserFromToken)(token);
        if (!user) {
            req.user = null;
        }
        req.user = user;
        next();
    }
    catch (err) {
        req.user = null; // If token is invalid, set user to null
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
