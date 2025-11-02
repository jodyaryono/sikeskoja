"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const PORT = config_1.config.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    console.log(`🚀 SiKesKoja Server is running on port ${PORT}`);
    console.log(`📊 Environment: ${config_1.config.NODE_ENV}`);
    console.log(`🔗 Server URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`📝 API Base: http://localhost:${PORT}/api`);
});
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
        console.log("Process terminated");
    });
});
process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
        console.log("Process terminated");
    });
});
exports.default = server;
//# sourceMappingURL=server.js.map