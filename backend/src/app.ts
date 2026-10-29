import express from "express";
import notFound from "./middleware/not_found.js";
import errorMiddleware from "./middleware/error_middleware.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use(notFound);
app.use(errorMiddleware);

export default app;
