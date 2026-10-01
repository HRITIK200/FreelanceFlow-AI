import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { restrictDemo } from "../middleware/restrictDemo.js";
import { validate } from "../middleware/validate.js";
import { createInvoiceSchema, updateInvoiceSchema } from "../validators/invoiceValidator.js";
import { createInvoice, getInvoices, updateInvoice, deleteInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", authMiddleware, restrictDemo, validate(createInvoiceSchema), createInvoice);
router.get("/", authMiddleware, getInvoices);
router.put("/:id", authMiddleware, restrictDemo, validate(updateInvoiceSchema), updateInvoice);
router.delete("/:id", authMiddleware, restrictDemo, deleteInvoice);

export default router;