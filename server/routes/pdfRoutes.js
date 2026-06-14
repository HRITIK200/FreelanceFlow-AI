import express from "express";

console.log("pdfRoutes.js loaded");

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