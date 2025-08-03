import { UserDocument } from "./user.types";

export interface AgentDocument extends UserDocument {
  status: "available" | "busy";
  currentParcels: number;
  maxCapacity: number;
}
