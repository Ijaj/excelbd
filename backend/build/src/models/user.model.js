"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ["admin", "agent", "customer"],
        default: "customer",
    },
    status: {
        type: String,
        required: true,
        enum: ["available", "busy"],
        default: "available",
    },
    currentParcels: { type: Number, required: true, default: 0 },
    maxCapacity: { type: Number, required: true, default: 10 },
    parcels: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Parcel",
        },
    ],
});
exports.User = mongoose_1.default.model("User", userSchema);
