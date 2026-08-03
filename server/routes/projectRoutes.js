import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "../validators/projectValidator.js";
import { createProject, getProjects, getProjectDetails, updateProject, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createProjectSchema), createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectDetails);
router.put("/:id", authMiddleware, validate(updateProjectSchema), updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;