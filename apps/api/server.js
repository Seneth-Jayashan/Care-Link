import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import routes from "./routes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// Rate Limiting
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
  })
);

// --- Serve uploaded files ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api/v1", routes);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});


// --- Start Server ---
app.listen(PORT, () =>
  console.log(`🚀 CareLink API running on port ${PORT} in ${process.env.NODE_ENV} mode`)
);
