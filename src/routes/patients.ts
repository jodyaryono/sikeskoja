import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientStatistics,
} from "../controllers/patientsController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validatePatient } from "../middleware/validation";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/patients - Get paginated patients with filtering
router.get("/", getPatients);

// GET /api/patients/search - Search patients
router.get("/search", searchPatients);

// GET /api/patients/statistics - Get patient statistics
router.get(
  "/statistics",
  requireRole(["ADMIN", "DOCTOR"]),
  getPatientStatistics
);

// GET /api/patients/:id - Get specific patient
router.get("/:id", getPatientById);

// POST /api/patients - Create new patient
router.post(
  "/",
  requireRole(["DOCTOR", "NURSE", "ADMIN"]),
  validatePatient,
  createPatient
);

// PUT /api/patients/:id - Update patient
router.put(
  "/:id",
  requireRole(["DOCTOR", "NURSE", "ADMIN"]),
  validatePatient,
  updatePatient
);

// DELETE /api/patients/:id - Delete patient
router.delete("/:id", requireRole(["ADMIN"]), deletePatient);

export default router;
