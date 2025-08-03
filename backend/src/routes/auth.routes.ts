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
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isAlphanumeric(),
    body("confirmPassword")
      .notEmpty()
      .isAlphanumeric()
      .if((value, { req }) => req.body.password === value),
    body("role")
      .notEmpty()
      .isIn(["customer", "agent"])
      .withMessage("Invalid value for role"),
    body("address").notEmpty(),
    body("phone").notEmpty().isMobilePhone("bn-BD"),
    validateMiddleware,
  ],
  registerUser
);
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isAlphanumeric()
      .withMessage("Password must be alphanumeric"),
    validateMiddleware,
  ],
  loginUser
);
router.get("/verify", verifyUser);

export default router;
