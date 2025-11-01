import { Router } from "express";
import {
  getAllRespondents,
  getRespondentById,
  createRespondent,
  updateRespondent,
  deleteRespondent,
  getRespondentStats,
} from "../controllers/respondentController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics
router.get("/stats", getRespondentStats);

// CRUD operations
router.get("/", getAllRespondents);
router.get("/:id", getRespondentById);
router.post("/", createRespondent);
router.put("/:id", updateRespondent);
router.delete("/:id", deleteRespondent);

export default router;
