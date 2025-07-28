import mongoose from "mongoose";
import { TaskDocument } from "./../types/task.type";

const taskSchema = new mongoose.Schema<TaskDocument>({
  category: {
    type: String,
    enum: [
      "arts_and_crafts",
      "nature",
      "family",
      "sport",
      "friends",
      "meditation",
    ],
    required: true,
  },
  description: { type: String, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["ongoing", "pending", "collaborative_task", "done"],
    required: true,
  },
});

export const Task = mongoose.model<TaskDocument>("Task", taskSchema);
