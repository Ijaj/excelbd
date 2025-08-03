import { Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "admin" | "agent" | "customer";
  parcels: Array<string>;
  status: "available" | "busy";
  currentParcels: number;
  maxCapacity: number;
}
