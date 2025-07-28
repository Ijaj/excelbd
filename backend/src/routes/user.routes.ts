import express from "express";
import { upsertTask, getTasks } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { errorHandler } from "../middlewares/error.middleware";

const router = express.Router();

router.get(
  "/tasks",
  [
    // header("authorization")
    //   .exists()
    //   .withMessage("Authorization header is missing")
    //   .matches(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
    //   .withMessage("Invalid Authorization header format"),
    // validateMiddleware,
    authMiddleware
  ],
  getTasks
);

router.put("/task", upsertTask);

export default router;
