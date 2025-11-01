import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Helper function to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation Error",
      details: errors.array(),
    });
  }
  next();
};

// Login validation
export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// Register validation
export const validateRegister = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long"),
  handleValidationErrors,
];

// Patient validation
export const validatePatient = [
  body("nik")
    .isLength({ min: 16, max: 16 })
    .withMessage("NIK must be exactly 16 digits")
    .isNumeric()
    .withMessage("NIK must contain only numbers"),
  body("fullName")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Please provide a valid date of birth"),
  body("gender")
    .isIn(["MALE", "FEMALE"])
    .withMessage("Gender must be either MALE or FEMALE"),
  body("address")
    .isLength({ min: 10 })
    .withMessage("Address must be at least 10 characters long"),
  handleValidationErrors,
];

// Health Record validation
export const validateHealthRecord = [
  body("patientId").notEmpty().withMessage("Patient ID is required"),
  body("recordType")
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
  body("recordDate")
    .isISO8601()
    .withMessage("Please provide a valid record date"),
  handleValidationErrors,
];

// User Update validation
export const validateUserUpdate = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("fullName")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long"),
  body("phone")
    .optional()
    .isMobilePhone("id-ID")
    .withMessage("Please provide a valid Indonesian phone number"),
  handleValidationErrors,
];
