const { PrismaClient } = require("@prisma/client");

/**
 * Singleton Prisma Client instance
 */
let prisma;

const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  return prisma;
};

/**
 * Error response helper
 */
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

/**
 * Success response helper
 */
const successResponse = (res, statusCode, data, message) => {
  const response = { success: true };
  if (message) response.message = message;
  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Async handler wrapper to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  getPrismaClient,
  errorResponse,
  successResponse,
  asyncHandler,
};
