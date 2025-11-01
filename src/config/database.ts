import { PrismaClient } from "@prisma/client";

// Optimized Prisma client for handling large datasets
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

// Connection pool optimization for high concurrent requests
prisma.$connect().catch(console.error);

export default prisma;
