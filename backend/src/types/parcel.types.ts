import { Date, Document } from "mongoose";

export type statusType =
  | "pending"
  | "picked-up"
  | "in-transit"
  | "delivered"
  | "failed"
  | "cancelled";

export type priorityType = "normal" | "high" | "urgent";

export type paymentType = "cod" | "pre-paid";

export interface timelineEntry {
  status: statusType;
  timestamp: number;
  updatedBy?: string;
  note?: string;
}

export interface ParcelDocument extends Document {
  id: string;
  trackingNumber: string;
  status: statusType;
  timeline: timelineEntry[];
  priority: priorityType;
  sender: {
    name: string;
    company: string | null;
    email: string;
    phone: string;
    address: string;
  };
  recipient: {
    name: string;
    company: string | null;
    email: string;
    phone: string;
    address: string;
  };
  packageDetails: {
    weight: string;
    value: string;
    description: string | null;
    dimensions: string | null;
  };
  dates: {
    created: Date;
    pickup: Date | null;
    estimated: Date | null;
  };
  assignedAgent: string | null;
  cost: number | null;
  location: string;
  paymentMethod: paymentType;
  lastUpdatedBy: string | null; // ID of the user who last updated the parcel
  lastStatusNote?: string; // optional note about the parcel
}
