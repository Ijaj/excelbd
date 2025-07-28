import app from "./src/app";
import { connectDB } from "./src/config/db";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  console.log(`Connected to the database successfully`);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
