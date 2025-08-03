import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(
      "MongoDB connected",
      mongoose.connection.host,
      mongoose.connection.port,
      mongoose.connection.name
    );
  } catch (err) {
    process.exit(1);
  }
};
