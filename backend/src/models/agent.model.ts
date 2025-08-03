import mongoose from "mongoose";
import "./task.model";
import { AgentDocument } from "../types/agent.types";

const agentSchema = new mongoose.Schema<AgentDocument>({
  status: { type: String, required: true },
  currentParcels: { type: Number, required: true, default: 0 },
  maxCapacity: { type: Number, required: true, default: 10 },
});

export const Agent = mongoose.model<AgentDocument>("Agent", agentSchema);
