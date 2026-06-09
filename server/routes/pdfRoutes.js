import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  generateInvoicePDF,
}
from "../controllers/pdfController.js";

const router =
  express.Router();

router.get(
  "/:id",
  authMiddleware,
  generateInvoicePDF
);

export default router;