import express from "express";
import { body } from "express-validator";
import {
  _delete,
  loginUser,
  registerUser,
  verifyUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateMiddleware } from "../middlewares/validate.middleware";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isAlphanumeric(),
    validateMiddleware,
  ],
  registerUser
);
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isAlphanumeric(),
    validateMiddleware,
  ],
  loginUser
);
router.get("/verify", verifyUser);
router.delete("/delete", [authMiddleware], _delete);

export default router;
