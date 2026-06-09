import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
}
from "../controllers/projectController.js";

const router =
  express.Router();

router.post(
  "/",
  authMiddleware,
  createProject
);

router.get(
  "/",
  authMiddleware,
  getProjects
);

router.put(
  "/:id",
  authMiddleware,
    updateProject
);

router.delete(
  "/:id",
  authMiddleware,
    deleteProject
);

export default router;