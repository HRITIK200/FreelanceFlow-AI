import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getDashboardStats, getReports } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/reports", authMiddleware, getReports);

export default router;