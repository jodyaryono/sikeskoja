"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var config_1 = require("./config");
var authSimple_1 = __importDefault(require("./routes/authSimple"));
var otpAuth_1 = __importDefault(require("./routes/otpAuth"));
var users_1 = __importDefault(require("./routes/users"));
// import questionnaireRouter from "./routes/questionnaires"; // OLD - disabled
// import respondentRouter from "./routes/respondents"; // OLD - disabled
var questionnaireKS_1 = __importDefault(require("./routes/questionnaireKS"));
var wilayah_1 = __importDefault(require("./routes/wilayah"));
var reports_1 = __importDefault(require("./routes/reports"));
var app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://sikeskoja.portnumbay.id",
        "http://sikeskoja.portnumbay.id",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get("/health", function (req, res) {
    res.json({
        status: "OK",
        message: "SiKesKoja API is running",
        timestamp: new Date().toISOString(),
        environment: config_1.config.NODE_ENV,
    });
});
// API Routes
app.use("/api/auth", authSimple_1.default);
app.use("/api/auth/otp", otpAuth_1.default);
app.use("/api/users", users_1.default);
// app.use("/api/questionnaires", questionnaireRouter); // OLD - disabled
// app.use("/api/respondents", respondentRouter); // OLD - disabled
app.use("/api/questionnaires-ks", questionnaireKS_1.default);
app.use("/api/wilayah", wilayah_1.default);
app.use("/api/reports", reports_1.default);
// Default route
app.get("/", function (req, res) {
    res.json({
        message: "Welcome to SiKesKoja API",
        version: "1.0.0",
        documentation: "/api/docs",
    });
});
// 404 handler
app.use("*", function (req, res) {
    res.status(404).json({
        error: "Not Found",
        message: "Route ".concat(req.originalUrl, " not found"),
    });
});
// Error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: config_1.config.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
    });
});
exports.default = app;
