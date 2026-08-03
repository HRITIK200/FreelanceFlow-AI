import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createInvoiceSchema, updateInvoiceSchema } from "../validators/invoiceValidator.js";
import { createInvoice, getInvoices, updateInvoice, deleteInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createInvoiceSchema), createInvoice);
router.get("/", authMiddleware, getInvoices);
router.put("/:id", authMiddleware, validate(updateInvoiceSchema), updateInvoice);
router.delete("/:id", authMiddleware, deleteInvoice);

export default router;