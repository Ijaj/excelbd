"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parcel_controller_1 = require("../controllers/parcel.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const express_validator_1 = require("express-validator");
const constants_1 = require("../utils/constants");
const validate_middleware_1 = require("../middlewares/validate.middleware");
function senderFieldRequired(field) {
    return (0, express_validator_1.body)(field).custom((value, { req }) => {
        if (!req.user || !["customer", "admin"].includes(req.user.role)) {
            if (!value)
                throw new Error(`${field.split(".").pop()} is required`);
        }
        return true;
    });
}
const router = express_1.default.Router();
router.post("/", [
    auth_middleware_1.optionalAuthMiddleware,
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(Object.keys(constants_1.statusConfig))
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("priority")
        .notEmpty()
        .withMessage("Priority is required")
        .isIn(Object.keys(constants_1.priorityConfig))
        .withMessage("Invalid value for priority"),
    senderFieldRequired("sender.name"),
    senderFieldRequired("sender.email")
        .isEmail()
        .withMessage("Invalid sender email"),
    senderFieldRequired("sender.phone")
        .isMobilePhone("bn-BD")
        .withMessage("Invalid sender phone"),
    senderFieldRequired("sender.address"),
    (0, express_validator_1.body)("sender.company")
        .optional()
        .isString()
        .withMessage("Sender company must be a string"),
    (0, express_validator_1.body)("receiver.name") // sender starts
        .notEmpty()
        .withMessage("Sender name is required"),
    (0, express_validator_1.body)("receiver.email")
        .notEmpty()
        .withMessage("Receiver email is required")
        .isEmail()
        .withMessage("Invalid receiver email"),
    (0, express_validator_1.body)("receiver.phone")
        .notEmpty()
        .withMessage("Receiver phone is required")
        .isMobilePhone("bn-BD")
        .withMessage("Invalid receiver phone"),
    (0, express_validator_1.body)("receiver.address")
        .notEmpty()
        .withMessage("Receiver address is required"),
    (0, express_validator_1.body)("receiver.company")
        .optional()
        .isString()
        .withMessage("Receiver company must be a string"),
    (0, express_validator_1.body)("packageDetails.weight")
        .isNumeric()
        .withMessage("Weight must be a number"),
    (0, express_validator_1.body)("packageDetails.value")
        .optional()
        .isNumeric()
        .withMessage("Value must be a number"),
    (0, express_validator_1.body)("packageDetails.dimensions")
        .optional()
        .isString()
        .withMessage("Dimensions must be a string"),
    (0, express_validator_1.body)("packageDetails.description")
        .optional()
        .isString()
        .withMessage("Content must be a string"),
], parcel_controller_1.addParcel); // anyone can create a parcel
router.get("/", [auth_middleware_1.authMiddleware, (0, role_middleware_1.allowOnly)("admin")], parcel_controller_1.getAllParcels);
router.get("/:trackingNumber", parcel_controller_1.getParcelByTrackingNumber); // anyone can see a parcel by tracking number
router.get("/agent/:agentId", [
    auth_middleware_1.authMiddleware,
    (0, role_middleware_1.allowOnly)("admin", "agent"),
    (0, express_validator_1.param)("agentId")
        .notEmpty()
        .withMessage("Agent ID is required")
        .isMongoId()
        .withMessage("Invalid agent ID"),
], parcel_controller_1.getParcelsByAgent);
router.get("/user/:email", [
    auth_middleware_1.authMiddleware,
    (0, role_middleware_1.allowOnly)("admin", "customer"),
    (0, express_validator_1.param)("email").isEmail().withMessage("Invalid email format"),
], parcel_controller_1.getParcelsByUser);
router.patch("/:trackingNumber", [
    auth_middleware_1.authMiddleware,
    (0, role_middleware_1.allowOnly)("admin", "agent"),
    (0, express_validator_1.param)("trackingNumber")
        .notEmpty()
        .isString()
        .withMessage("Invalid tracking number"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(Object.keys(constants_1.statusConfig))
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("priority")
        .optional()
        .isIn(Object.keys(constants_1.priorityConfig))
        .withMessage("Invalid priority"),
    (0, express_validator_1.body)("assignedAgent")
        .optional()
        .isMongoId()
        .withMessage("Assigned agent must be a valid MongoDB ID"),
    (0, express_validator_1.body)("dates.estimated")
        .optional()
        .isISO8601()
        .withMessage("Estimated date must be a valid ISO8601 date"),
    validate_middleware_1.validateMiddleware,
], parcel_controller_1.updateParcel);
router.delete("/", [
    auth_middleware_1.authMiddleware,
    (0, express_validator_1.body)("trackingNumber")
        .notEmpty()
        .isArray()
        .withMessage("Invalid tracking number"),
    (0, role_middleware_1.allowOnly)("admin"),
], parcel_controller_1.deleteParcel);
exports.default = router;
