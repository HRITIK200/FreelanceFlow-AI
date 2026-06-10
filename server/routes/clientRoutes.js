import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createClient,
  getMyClients,
  updateClient,
  deleteClient,
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
router.put(
  "/:id",
  authMiddleware,
    updateClient
);
router.delete(
  "/:id",
  authMiddleware,
  deleteClient
);

export default router;