import http from "http";
import app from "./src/app";
import { connectDB } from "./src/config/db";
import { socketService } from "./src/services/socket.service";

const server = http.createServer(app);
socketService.initialize(server);

// Connect to DB once (Vercel runs functions cold/warm)
connectDB().then(() => {
  console.log(`Connected to the database successfully`);
});

// ✅ Export server as default handler (no app.listen)
export default server;
