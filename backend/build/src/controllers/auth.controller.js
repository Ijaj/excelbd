"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.loginUser = exports.registerUser = void 0;
exports._delete = _delete;
const auth_service_1 = require("../services/auth.service");
const helpers_1 = require("../utils/helpers");
const ApiError_1 = require("../utils/ApiError");
const registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, ...rest } = req.body;
        const fullName = `${firstName} ${lastName}`.trim();
        const userData = { ...rest, name: fullName };
        if (userData.password !== userData.confirmPassword) {
            res.status(400).json({ message: "Passwords do not match" });
            return;
        }
        delete userData.confirmPassword;
        const token = await (0, auth_service_1.register)(userData);
        res.status(201).send();
    }
    catch (err) {
        next(new ApiError_1.ApiError(400, "Registration failed", [
            { field: "email", message: "Email already exists" },
        ]));
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const [token, user] = await (0, auth_service_1.login)(req.body);
        res.status(200).json({ user, token });
    }
    catch (err) {
        next(err);
    }
};
exports.loginUser = loginUser;
const verifyUser = async (req, res, next) => {
    try {
        const token = (0, helpers_1.getTokenFromRequest)(req);
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        }
        else {
            const user = await (0, helpers_1.getUserFromToken)(token);
            res.status(200).json({ user });
        }
    }
    catch (err) {
        next(err);
    }
};
exports.verifyUser = verifyUser;
async function _delete(req, res, next) {
    try {
        const deleted = await (0, auth_service_1.deleteUser)(req.user._id);
        if (deleted === 1) {
            res.status(204).send();
        }
        else {
            // res.status(404).json({ message: "The requested user was not found" });
            next(new ApiError_1.ApiError(404, "User not found"));
        }
    }
    catch (error) {
        next(error);
    }
}
