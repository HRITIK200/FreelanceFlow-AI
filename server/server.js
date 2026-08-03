import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// ── Security Headers ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Needed for PDF downloads
}));

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "https://freelance-flow-ai-chi.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /https:\/\/freelance-flow.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));

// ── General Rate Limit ────────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", app: "FreelanceFlow AI", version: "2.0.0" });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/activity", activityRoutes);

// ── Admin Route ───────────────────────────────────────────────────────────────
app.get("/api/admin", authMiddleware, roleMiddleware("ADMIN"), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// ── Centralized Error Handler (must be last) ──────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ FreelanceFlow AI Server running on port ${PORT}`);
});