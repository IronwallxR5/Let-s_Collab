const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Optional authentication - attaches user if token exists but doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log("Optional auth failed:", error.message);
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
