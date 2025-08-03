import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowOnly } from "../middlewares/role.middleware";
import {
  getAllAgents,
  getAllAvailableAgents,
  getAllUsers,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", [authMiddleware, allowOnly("admin")], getAllUsers);
router.get("/agents", [authMiddleware, allowOnly("admin")], getAllAgents);
router.get(
  "/agents/available",
  [authMiddleware, allowOnly("admin")],
  getAllAvailableAgents
);

export default router;
