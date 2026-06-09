import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  createProject,
}
from "../controllers/projectController.js";

const router =
  express.Router();

router.post(
  "/",
  authMiddleware,
  createProject
);

export default router;