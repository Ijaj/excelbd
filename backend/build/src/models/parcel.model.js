"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../utils/constants");
const helpers_1 = require("../utils/helpers");
const timelineSchema = new mongoose_1.Schema({
    status: {
        type: String,
        required: true,
        enum: [
            "created",
            "pending",
            "picked-up",
            "in-transit",
            "delivered",
            "failed",
            "cancelled",
        ],
        default: "pending",
    },
    timestamp: { type: Number, required: true, default: Date.now },
    updatedBy: { type: String, required: false, default: null },
    note: { type: String, required: false, default: null },
});
const ParcelSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => (0, helpers_1.generateParcelId)(),
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
        default: () => (0, helpers_1.generateTrackingNumber)(),
    },
    status: { type: String, required: true, default: "pending" },
    timeline: [timelineSchema],
    priority: { type: String, required: true, default: "normal" },
    sender: {
        name: { type: String, required: true },
        company: { type: String, required: false, default: null },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    recipient: {
        name: { type: String, required: true },
        company: { type: String, required: false, default: null },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    packageDetails: {
        weight: { type: String, required: true },
        value: { type: String, required: true },
        description: { type: String, required: false, default: null },
        dimensions: { type: String, required: false, default: null },
    },
    dates: {
        created: {
            type: Date,
            required: true,
            default: Date.now,
            get: (v) => v.toISOString(),
        },
        pickup: {
            type: Date,
            required: false,
            default: null,
            get: (v) => v.toISOString(),
        },
        estimated: {
            type: Date,
            required: false,
            default: () => (0, constants_1.defaultEstimatedDate)(),
            get: (v) => v.toISOString(),
        },
    },
    assignedAgent: { type: String, required: false, default: null },
    cost: {
        type: Number,
        required: false,
        default: () => 10 + Math.floor(Math.random() * 500),
    },
    location: { type: String, required: false, default: null },
    paymentMethod: { type: String, required: true, default: "cod" },
    lastUpdatedBy: { type: String, required: false, default: null },
    lastStatusNote: { type: String, required: false, default: null },
});
ParcelSchema.pre("save", async function (next) {
    const parcel = this;
    if (parcel.isModified("status")) {
        const timelineEntry = {
            status: parcel.status,
            timestamp: Date.now(),
            updatedBy: parcel.assignedAgent || parcel.lastUpdatedBy || "system",
            note: parcel.lastStatusNote || "",
        };
        parcel.timeline.push(timelineEntry);
    }
    next();
});
exports.ParcelModel = mongoose_1.default.model("Parcel", ParcelSchema);
