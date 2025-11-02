"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
// Optimized Prisma client for handling large datasets
var prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
});
// Connection pool optimization for high concurrent requests
prisma.$connect().catch(console.error);
exports.default = prisma;
