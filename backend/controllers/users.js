const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getCurrentUser(req, res) {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        username: true,
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
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { name, username, email } = req.body;

    // Check if at least one field is being updated
    if (name === undefined && username === undefined && email === undefined) {
      return res.status(400).json({ error: "At least one field (name, username, or email) is required" });
    }

    const updateData = {};

    // Update name if provided
    if (name !== undefined) {
      if (name.trim() === "") {
        return res.status(400).json({ error: "Name cannot be empty" });
      }
      updateData.name = name.trim();
    }

    // Update username if provided
    if (username !== undefined) {
      const usernameValue = username.trim().toLowerCase();
      
      if (usernameValue === "") {
        return res.status(400).json({ error: "Username cannot be empty" });
      }
      
      // Validate username format
      const usernameRegex = /^[a-z0-9._-]+$/;
      if (!usernameRegex.test(usernameValue)) {
        return res.status(400).json({
          error: "Username can only contain lowercase letters, numbers, dots, hyphens, and underscores",
        });
      }
      
      if (usernameValue.length < 3 || usernameValue.length > 30) {
        return res.status(400).json({
          error: "Username must be between 3 and 30 characters",
        });
      }
      
      if (/^[.-]|[.-]$/.test(usernameValue)) {
        return res.status(400).json({
          error: "Username cannot start or end with dots or hyphens",
        });
      }

      // Check if username is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { username: usernameValue },
      });

      if (existingUser && existingUser.id !== decoded.id) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      updateData.username = usernameValue;
    }

    // Update email if provided
    if (email !== undefined) {
      const emailValue = email.trim().toLowerCase();
      
      if (emailValue === "") {
        return res.status(400).json({ error: "Email cannot be empty" });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email: emailValue },
      });

      if (existingUser && existingUser.id !== decoded.id) {
        return res.status(400).json({ error: "Email is already taken" });
      }

      updateData.email = emailValue;
    }

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getCurrentUser,
  updateProfile,
};
