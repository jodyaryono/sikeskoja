import { Router } from "express";
import {
  getHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthRecordsByPatient,
  searchHealthRecords,
} from "../controllers/healthRecordsController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validateHealthRecord } from "../middleware/validation";

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/health-records - Get paginated health records with filtering
router.get("/", getHealthRecords);

// GET /api/health-records/search - Search health records
router.get("/search", searchHealthRecords);

// GET /api/health-records/:id - Get specific health record
router.get("/:id", getHealthRecordById);

// GET /api/health-records/patient/:patientId - Get health records by patient
router.get("/patient/:patientId", getHealthRecordsByPatient);

// POST /api/health-records - Create new health record
router.post(
  "/",
  requireRole(["DOCTOR", "NURSE", "ADMIN"]),
  validateHealthRecord,
  createHealthRecord
);

// PUT /api/health-records/:id - Update health record
router.put(
  "/:id",
  requireRole(["DOCTOR", "NURSE", "ADMIN"]),
  validateHealthRecord,
  updateHealthRecord
);

// DELETE /api/health-records/:id - Delete health record
router.delete("/:id", requireRole(["ADMIN"]), deleteHealthRecord);

export default router;
