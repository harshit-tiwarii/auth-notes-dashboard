import express from "express";
const app = express();
import cors from "cors";
import errorHandler from "./middleware/errorHandler.middleware.js";
import dbConnection from "./config/db.config.js";
import { authRoute } from "./router/auth.router.js";
import { notesRoute } from "./router/notes.router.js";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// routes
app.use("/api/auth", authRoute);
app.use("/api/notes", notesRoute);

// error handler
app.use(errorHandler);

export default app
