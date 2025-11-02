"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const respondentController_1 = require("../controllers/respondentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Statistics
router.get("/stats", respondentController_1.getRespondentStats);
// CRUD operations
router.get("/", respondentController_1.getAllRespondents);
router.get("/:id", respondentController_1.getRespondentById);
router.post("/", respondentController_1.createRespondent);
router.put("/:id", respondentController_1.updateRespondent);
router.delete("/:id", respondentController_1.deleteRespondent);
exports.default = router;
//# sourceMappingURL=respondents.js.map