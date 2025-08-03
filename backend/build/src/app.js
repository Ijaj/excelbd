"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middlewares/error.middleware");
// routes imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const parcel_routes_1 = __importDefault(require("./routes/parcel.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// mongoose
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/parcel", parcel_routes_1.default);
app.use("/api/user", user_routes_1.default);
// health check api
app.get("/api/health", async (req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    // States: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    function getDbStateMessage(state) {
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
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
