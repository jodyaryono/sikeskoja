"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionnaireController_1 = require("../controllers/questionnaireController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Statistics
router.get("/stats", questionnaireController_1.getQuestionnaireStats);
// CRUD operations
router.get("/", questionnaireController_1.getAllQuestionnaires);
router.get("/:id", questionnaireController_1.getQuestionnaireById);
router.post("/", questionnaireController_1.createQuestionnaire);
router.put("/:id", questionnaireController_1.updateQuestionnaire);
router.delete("/:id", questionnaireController_1.deleteQuestionnaire);
// Anggota keluarga operations
router.put("/:id/anggota/:anggotaId", questionnaireController_1.updateAnggotaKeluarga);
router.delete("/:id/anggota/:anggotaId", questionnaireController_1.deleteAnggotaKeluarga);
exports.default = router;
//# sourceMappingURL=questionnaires.js.map