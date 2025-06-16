import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { connectDB } from "./configs/connectDB.js";
import { errorResponseHandler, invalidPathHandler } from "./middlewares/errorHandlers.js";
dotenv.config();

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

app.use(invalidPathHandler)
app.use(errorResponseHandler)

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
