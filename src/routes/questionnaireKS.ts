import express from "express";
import {
  createQuestionnaireKS,
  getAllQuestionnaireKS,
  getQuestionnaireKSById,
  updateQuestionnaireKS,
  deleteQuestionnaireKS,
  getKSDashboardStats,
} from "../controllers/questionnaireKSController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard Stats
router.get("/stats", getKSDashboardStats);

// CRUD Operations
router.post("/", createQuestionnaireKS);
router.get("/", getAllQuestionnaireKS);
router.get("/:id", getQuestionnaireKSById);
router.put("/:id", updateQuestionnaireKS);
router.delete("/:id", deleteQuestionnaireKS);

export default router;
