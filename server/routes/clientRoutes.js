import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createClient,
  getMyClients,
} from "../controllers/clientController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createClient
);
router.get(
  "/",
  authMiddleware,
  getMyClients
);

export default router;