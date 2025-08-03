import express from "express";
import {
  getAllParcels,
  getParcelsByUser,
  getParcelByTrackingNumber,
  updateParcel,
  getParcelsByAgent,
  addParcel,
  deleteParcel,
} from "../controllers/parcel.controller";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/auth.middleware";
import { allowOnly } from "../middlewares/role.middleware";
import { body, param } from "express-validator";
import { priorityConfig, statusConfig } from "../utils/constants";
import { validateMiddleware } from "../middlewares/validate.middleware";

function senderFieldRequired(field: string) {
  return body(field).custom((value, { req }) => {
    if (!req.user || !["customer", "admin"].includes(req.user.role)) {
      if (!value) throw new Error(`${field.split(".").pop()} is required`);
    }
    return true;
  });
}

const router = express.Router();

router.post(
  "/",
  [
    optionalAuthMiddleware,
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(Object.keys(statusConfig))
      .withMessage("Invalid status"),
    body("priority")
      .notEmpty()
      .withMessage("Priority is required")
      .isIn(Object.keys(priorityConfig))
      .withMessage("Invalid value for priority"),
    senderFieldRequired("sender.name"),
    senderFieldRequired("sender.email")
      .isEmail()
      .withMessage("Invalid sender email"),
    senderFieldRequired("sender.phone")
      .isMobilePhone("bn-BD")
      .withMessage("Invalid sender phone"),
    senderFieldRequired("sender.address"),
    body("sender.company")
      .optional()
      .isString()
      .withMessage("Sender company must be a string"),
    body("receiver.name") // sender starts
      .notEmpty()
      .withMessage("Sender name is required"),
    body("receiver.email")
      .notEmpty()
      .withMessage("Receiver email is required")
      .isEmail()
      .withMessage("Invalid receiver email"),
    body("receiver.phone")
      .notEmpty()
      .withMessage("Receiver phone is required")
      .isMobilePhone("bn-BD")
      .withMessage("Invalid receiver phone"),
    body("receiver.address")
      .notEmpty()
      .withMessage("Receiver address is required"),
    body("receiver.company")
      .optional()
      .isString()
      .withMessage("Receiver company must be a string"),
    body("packageDetails.weight")
      .isNumeric()
      .withMessage("Weight must be a number"),
    body("packageDetails.value")
      .optional()
      .isNumeric()
      .withMessage("Value must be a number"),
    body("packageDetails.dimensions")
      .optional()
      .isString()
      .withMessage("Dimensions must be a string"),
    body("packageDetails.description")
      .optional()
      .isString()
      .withMessage("Content must be a string"),
  ],
  addParcel
); // anyone can create a parcel
router.get("/", [authMiddleware, allowOnly("admin")], getAllParcels);
router.get("/:trackingNumber", getParcelByTrackingNumber); // anyone can see a parcel by tracking number
router.get(
  "/agent/:agentId",
  [
    authMiddleware,
    allowOnly("admin", "agent"),
    param("agentId")
      .notEmpty()
      .withMessage("Agent ID is required")
      .isMongoId()
      .withMessage("Invalid agent ID"),
  ],
  getParcelsByAgent
);

router.get(
  "/user/:email",
  [
    authMiddleware,
    allowOnly("admin", "customer"),
    param("email").isEmail().withMessage("Invalid email format"),
  ],
  getParcelsByUser
);

router.patch(
  "/:trackingNumber",
  [
    authMiddleware,
    allowOnly("admin", "agent"),
    param("trackingNumber")
      .notEmpty()
      .isString()
      .withMessage("Invalid tracking number"),
    body("status")
      .optional()
      .isIn(Object.keys(statusConfig))
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(Object.keys(priorityConfig))
      .withMessage("Invalid priority"),
    body("assignedAgent")
      .optional()
      .isMongoId()
      .withMessage("Assigned agent must be a valid MongoDB ID"),
    body("dates.estimated")
      .optional()
      .isISO8601()
      .withMessage("Estimated date must be a valid ISO8601 date"),
    validateMiddleware,
  ],
  updateParcel
);
router.delete(
  "/",
  [
    authMiddleware,
    body("trackingNumber")
      .notEmpty()
      .isArray()
      .withMessage("Invalid tracking number"),
    allowOnly("admin"),
  ],
  deleteParcel
);

export default router;
