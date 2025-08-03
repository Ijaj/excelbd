"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/", [auth_middleware_1.authMiddleware, (0, role_middleware_1.allowOnly)("admin")], user_controller_1.getAllUsers);
router.get("/agents", [auth_middleware_1.authMiddleware, (0, role_middleware_1.allowOnly)("admin")], user_controller_1.getAllAgents);
router.get("/agents/available", [auth_middleware_1.authMiddleware, (0, role_middleware_1.allowOnly)("admin")], user_controller_1.getAllAvailableAgents);
exports.default = router;
