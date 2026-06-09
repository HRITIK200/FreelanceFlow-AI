import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  createInvoice,
} from "../controllers/invoiceController.js";

const router =
  express.Router();

router.post(
  "/",
  authMiddleware,
  createInvoice
);

export default router;