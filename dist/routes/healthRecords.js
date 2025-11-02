"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthRecordsController_1 = require("../controllers/healthRecordsController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Apply authentication to all routes
router.use(auth_1.authenticateToken);
// GET /api/health-records - Get paginated health records with filtering
router.get("/", healthRecordsController_1.getHealthRecords);
// GET /api/health-records/search - Search health records
router.get("/search", healthRecordsController_1.searchHealthRecords);
// GET /api/health-records/:id - Get specific health record
router.get("/:id", healthRecordsController_1.getHealthRecordById);
// GET /api/health-records/patient/:patientId - Get health records by patient
router.get("/patient/:patientId", healthRecordsController_1.getHealthRecordsByPatient);
// POST /api/health-records - Create new health record
router.post("/", (0, auth_1.requireRole)(["DOCTOR", "NURSE", "ADMIN"]), validation_1.validateHealthRecord, healthRecordsController_1.createHealthRecord);
// PUT /api/health-records/:id - Update health record
router.put("/:id", (0, auth_1.requireRole)(["DOCTOR", "NURSE", "ADMIN"]), validation_1.validateHealthRecord, healthRecordsController_1.updateHealthRecord);
// DELETE /api/health-records/:id - Delete health record
router.delete("/:id", (0, auth_1.requireRole)(["ADMIN"]), healthRecordsController_1.deleteHealthRecord);
exports.default = router;
//# sourceMappingURL=healthRecords.js.map