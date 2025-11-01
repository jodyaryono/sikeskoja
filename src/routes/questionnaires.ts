import { Router } from "express";
import {
  getAllQuestionnaires,
  getQuestionnaireById,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaireStats,
  deleteAnggotaKeluarga,
  updateAnggotaKeluarga,
} from "../controllers/questionnaireController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Statistics
router.get("/stats", getQuestionnaireStats);

// CRUD operations
router.get("/", getAllQuestionnaires);
router.get("/:id", getQuestionnaireById);
router.post("/", createQuestionnaire);
router.put("/:id", updateQuestionnaire);
router.delete("/:id", deleteQuestionnaire);

// Anggota keluarga operations
router.put("/:id/anggota/:anggotaId", updateAnggotaKeluarga);
router.delete("/:id/anggota/:anggotaId", deleteAnggotaKeluarga);

export default router;
