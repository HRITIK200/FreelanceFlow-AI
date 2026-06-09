import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  emailInvoice,
}
from "../controllers/emailController.js";

const router =
  express.Router();

router.post(
  "/invoice/:id",
  authMiddleware,
  emailInvoice
);

export default router;