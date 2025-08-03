"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.verifyToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const register = async (userData) => {
    const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
    const newData = { ...userData, password: hashedPassword };
    const user = await user_model_1.User.create(newData);
    return jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
};
exports.register = register;
const login = async ({ email, password }) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new ApiError_1.ApiError(401, "Invalid Email", [
            { field: "email", message: "Invalid Email" },
        ]);
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new ApiError_1.ApiError(401, "Invalid Passowrd", [
            { field: "password", message: "Invalid Password" },
        ]);
    // Remove password before returning user
    const { password: _password, ...userObj } = user.toObject();
    return [
        jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        }),
        userObj,
    ];
};
exports.login = login;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        throw new ApiError_1.ApiError(498, "Invalid token");
    }
};
exports.verifyToken = verifyToken;
const deleteUser = async (id) => {
    const d = await user_model_1.User.deleteOne({ _id: id });
    return d.deletedCount;
};
exports.deleteUser = deleteUser;
