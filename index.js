import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
// import dotenv from "dotenv";
// dotenv.config();
import { connectDB } from "./configs/connectDB.js";
import {
  errorResponseHandler,
  invalidPathHandler,
} from "./middlewares/errorHandlers.js";
import AuthRoute from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

connectDB();

app.use("/api/auth/v1", AuthRoute);

app.use(invalidPathHandler);
app.use(errorResponseHandler);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
