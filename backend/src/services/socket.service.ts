import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

class SocketService {
  private io: Server;

  constructor() {
    this.io = new Server();
  }

  public initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // Allow all origins for now
        methods: ["GET", "POST", "PATCH", "DELETE"],
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected");

      socket.on("joinParcelRoom", (trackingNumber: string) => {
        socket.join(trackingNumber);
        console.log(`User joined room for parcel: ${trackingNumber}`);
      });

      socket.on("leaveParcelRoom", (trackingNumber: string) => {
        socket.leave(trackingNumber);
        console.log(`User left room for parcel: ${trackingNumber}`);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  }

  public emitEvent(eventName: string, data: any) {
    this.io.emit(eventName, data);
  }

  public emitToRoom(room: string, eventName: string, data: any) {
    this.io.to(room).emit(eventName, data);
  }
}

export const socketService = new SocketService();
