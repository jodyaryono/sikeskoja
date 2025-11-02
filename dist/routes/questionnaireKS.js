"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var questionnaireKSController_1 = require("../controllers/questionnaireKSController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Dashboard Stats
router.get("/stats", questionnaireKSController_1.getKSDashboardStats);
// CRUD Operations
router.post("/", questionnaireKSController_1.createQuestionnaireKS);
router.get("/", questionnaireKSController_1.getAllQuestionnaireKS);
router.get("/:id", questionnaireKSController_1.getQuestionnaireKSById);
router.put("/:id", questionnaireKSController_1.updateQuestionnaireKS);
router.delete("/:id", questionnaireKSController_1.deleteQuestionnaireKS);
exports.default = router;
