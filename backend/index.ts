import http from "http";
import app from "./src/app";
import { connectDB } from "./src/config/db";
import { socketService } from "./src/services/socket.service";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

socketService.initialize(server);

connectDB().then(() => {
  console.log(`Connected to the database successfully`);
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
