import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config";
import authRouter from "./routes/authSimple";
import otpAuthRouter from "./routes/otpAuth";
// import questionnaireRouter from "./routes/questionnaires"; // OLD - disabled
// import respondentRouter from "./routes/respondents"; // OLD - disabled
import questionnaireKSRouter from "./routes/questionnaireKS";
import wilayahRouter from "./routes/wilayah";
import reportsRouter from "./routes/reports";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SiKesKoja API is running",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/auth/otp", otpAuthRouter);
// app.use("/api/questionnaires", questionnaireRouter); // OLD - disabled
// app.use("/api/respondents", respondentRouter); // OLD - disabled
app.use("/api/questionnaires-ks", questionnaireKSRouter);
app.use("/api/wilayah", wilayahRouter);
app.use("/api/reports", reportsRouter);

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to SiKesKoja API",
    version: "1.0.0",
    documentation: "/api/docs",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Internal Server Error",
      message:
        config.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

export default app;
