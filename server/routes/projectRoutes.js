import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { restrictDemo } from "../middleware/restrictDemo.js";
import { validate } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "../validators/projectValidator.js";
import { createProject, getProjects, getProjectDetails, updateProject, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", authMiddleware, restrictDemo, validate(createProjectSchema), createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectDetails);
router.put("/:id", authMiddleware, restrictDemo, validate(updateProjectSchema), updateProject);
router.delete("/:id", authMiddleware, restrictDemo, deleteProject);

export default router;