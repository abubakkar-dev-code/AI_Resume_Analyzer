import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

dotenv.config();
const startServer = async () => {
  try {
    await connectDb();
    app.listen(process.env.PORT, () => {
      console.log(`server running successfully on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("somethingent wrong while running server", error);
  }
};
startServer();
