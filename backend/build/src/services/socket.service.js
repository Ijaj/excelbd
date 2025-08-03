"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const socket_io_1 = require("socket.io");
class SocketService {
    constructor() {
        this.io = new socket_io_1.Server();
    }
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*", // Allow all origins for now
                methods: ["GET", "POST", "PATCH", "DELETE"],
            },
        });
        this.io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("joinParcelRoom", (trackingNumber) => {
                socket.join(trackingNumber);
                console.log(`User joined room for parcel: ${trackingNumber}`);
            });
            socket.on("leaveParcelRoom", (trackingNumber) => {
                socket.leave(trackingNumber);
                console.log(`User left room for parcel: ${trackingNumber}`);
            });
            socket.on("disconnect", () => {
                console.log("A user disconnected");
            });
        });
    }
    emitEvent(eventName, data) {
        this.io.emit(eventName, data);
    }
    emitToRoom(room, eventName, data) {
        this.io.to(room).emit(eventName, data);
    }
}
exports.socketService = new SocketService();
