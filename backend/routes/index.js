const express = require("express");
const boardRoutes = require("./board-routes");
const authRoutes = require("./auth-routes");

const router = express.Router();

// Auth routes
router.use("/auth", authRoutes);

// Board routes
router.use("/boards", boardRoutes);

module.exports = router;
