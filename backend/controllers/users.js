const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getUserFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

async function getCurrentUser(req, res) {
  try {
    const token = req.cookies.token;
    const decoded = getUserFromToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateProfile(req, res) {
  try {
    const token = req.cookies.token;
    const decoded = getUserFromToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getCurrentUser,
  updateProfile,
};
