"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.body)("firstName").notEmpty(),
    (0, express_validator_1.body)("lastName").notEmpty(),
    (0, express_validator_1.body)("email").notEmpty().isEmail(),
    (0, express_validator_1.body)("password").notEmpty().isAlphanumeric(),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .isAlphanumeric()
        .if((value, { req }) => req.body.password === value),
    (0, express_validator_1.body)("role")
        .notEmpty()
        .isIn(["customer", "agent"])
        .withMessage("Invalid value for role"),
    (0, express_validator_1.body)("address").notEmpty(),
    (0, express_validator_1.body)("phone").notEmpty().isMobilePhone("bn-BD"),
    validate_middleware_1.validateMiddleware,
], auth_controller_1.registerUser);
router.post("/login", [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isAlphanumeric()
        .withMessage("Password must be alphanumeric"),
    validate_middleware_1.validateMiddleware,
], auth_controller_1.loginUser);
router.get("/verify", auth_controller_1.verifyUser);
exports.default = router;
