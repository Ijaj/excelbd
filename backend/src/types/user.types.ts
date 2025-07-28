import { Document } from "mongoose";
import { TaskDocument } from "./task.type";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  tasks: TaskDocument[];
}
