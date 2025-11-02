"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserUpdate = exports.validateHealthRecord = exports.validatePatient = exports.validateRegister = exports.validateLogin = exports.handleValidationErrors = void 0;
var express_validator_1 = require("express-validator");
// Helper function to handle validation errors
var handleValidationErrors = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation Error",
            details: errors.array(),
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
// Login validation
exports.validateLogin = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    exports.handleValidationErrors,
];
// Register validation
exports.validateRegister = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("fullName")
        .isLength({ min: 2 })
        .withMessage("Full name must be at least 2 characters long"),
    exports.handleValidationErrors,
];
// Patient validation
exports.validatePatient = [
    (0, express_validator_1.body)("nik")
        .isLength({ min: 16, max: 16 })
        .withMessage("NIK must be exactly 16 digits")
        .isNumeric()
        .withMessage("NIK must contain only numbers"),
    (0, express_validator_1.body)("fullName")
        .isLength({ min: 2 })
        .withMessage("Full name must be at least 2 characters long"),
    (0, express_validator_1.body)("dateOfBirth")
        .isISO8601()
        .withMessage("Please provide a valid date of birth"),
    (0, express_validator_1.body)("gender")
        .isIn(["MALE", "FEMALE"])
        .withMessage("Gender must be either MALE or FEMALE"),
    (0, express_validator_1.body)("address")
        .isLength({ min: 10 })
        .withMessage("Address must be at least 10 characters long"),
    exports.handleValidationErrors,
];
// Health Record validation
exports.validateHealthRecord = [
    (0, express_validator_1.body)("patientId").notEmpty().withMessage("Patient ID is required"),
    (0, express_validator_1.body)("recordType")
        .isIn([
        "GENERAL_CHECKUP",
        "EMERGENCY",
        "FOLLOW_UP",
        "SPECIALIST_CONSULTATION",
        "VACCINATION",
        "SURGERY",
        "LABORATORY",
        "IMAGING",
        "THERAPY",
    ])
        .withMessage("Invalid record type"),
    (0, express_validator_1.body)("recordDate")
        .isISO8601()
        .withMessage("Please provide a valid record date"),
    exports.handleValidationErrors,
];
// User Update validation
exports.validateUserUpdate = [
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("fullName")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Full name must be at least 2 characters long"),
    (0, express_validator_1.body)("phone")
        .optional()
        .isMobilePhone("id-ID")
        .withMessage("Please provide a valid Indonesian phone number"),
    exports.handleValidationErrors,
];
