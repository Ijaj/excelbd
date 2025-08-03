"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./src/app"));
const db_1 = require("./src/config/db");
const socket_service_1 = require("./src/services/socket.service");
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
socket_service_1.socketService.initialize(server);
(0, db_1.connectDB)().then(() => {
    console.log(`Connected to the database successfully`);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
