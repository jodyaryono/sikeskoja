"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientsController_1 = require("../controllers/patientsController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Apply authentication to all routes
router.use(auth_1.authenticateToken);
// GET /api/patients - Get paginated patients with filtering
router.get("/", patientsController_1.getPatients);
// GET /api/patients/search - Search patients
router.get("/search", patientsController_1.searchPatients);
// GET /api/patients/statistics - Get patient statistics
router.get("/statistics", (0, auth_1.requireRole)(["ADMIN", "DOCTOR"]), patientsController_1.getPatientStatistics);
// GET /api/patients/:id - Get specific patient
router.get("/:id", patientsController_1.getPatientById);
// POST /api/patients - Create new patient
router.post("/", (0, auth_1.requireRole)(["DOCTOR", "NURSE", "ADMIN"]), validation_1.validatePatient, patientsController_1.createPatient);
// PUT /api/patients/:id - Update patient
router.put("/:id", (0, auth_1.requireRole)(["DOCTOR", "NURSE", "ADMIN"]), validation_1.validatePatient, patientsController_1.updatePatient);
// DELETE /api/patients/:id - Delete patient
router.delete("/:id", (0, auth_1.requireRole)(["ADMIN"]), patientsController_1.deletePatient);
exports.default = router;
//# sourceMappingURL=patients.js.map