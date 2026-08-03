import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createClientSchema, updateClientSchema } from "../validators/clientValidator.js";
import { createClient, getMyClients, getClientDetails, updateClient, deleteClient } from "../controllers/clientController.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createClientSchema), createClient);
router.get("/", authMiddleware, getMyClients);
router.get("/:id", authMiddleware, getClientDetails);
router.put("/:id", authMiddleware, validate(updateClientSchema), updateClient);
router.delete("/:id", authMiddleware, deleteClient);

export default router;