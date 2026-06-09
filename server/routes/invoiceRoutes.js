import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  createInvoice,
  getInvoices,
  updateInvoiceStatus,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router =
  express.Router();

router.post(
  "/",
  authMiddleware,
  createInvoice
);
router.get(
  "/",
  authMiddleware,
  getInvoices
);
router.put(
  "/:id",
  authMiddleware,
  updateInvoiceStatus
);
router.delete(
  "/:id",
  authMiddleware,
  deleteInvoice
);

export default router;