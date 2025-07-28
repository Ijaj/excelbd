import { Document } from "mongoose";

export interface TaskDocument extends Document {
  category:
    | "arts_and_crafts"
    | "nature"
    | "family"
    | "sport"
    | "friends"
    | "meditation";
  description: string;
  endDate: Date;
  status: "ongoing" | "pending" | "collaborative_task" | "done";
}
