import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

// routes imports
import authRoutes from "./routes/auth.routes";
import userRouter from "./routes/user.routes";

// mongoose
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

// health check api

app.get("/api/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  // States: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  function getDbStateMessage(state: number): string {
    switch (state) {
      case 0:
        return "Database is disconnected";
      case 1:
        return "Database is connected";
      case 2:
        return "Database is connecting";
      case 3:
        return "Database is disconnecting";
      default:
        return "Database state is unknown";
    }
  }

  const isDbConnected = dbState === 1;
  const db = getDbStateMessage(dbState);
  const status = isDbConnected ? "ok" : "fail";
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();

  res.status(200).json({ status, db, uptime, timestamp });
});

// 404 and 500 handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
