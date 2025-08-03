"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("./task.model");
const agentSchema = new mongoose_1.default.Schema({
    status: { type: String, required: true },
    currentParcels: { type: Number, required: true, default: 0 },
    maxCapacity: { type: Number, required: true, default: 10 },
});
exports.Agent = mongoose_1.default.model("Agent", agentSchema);
