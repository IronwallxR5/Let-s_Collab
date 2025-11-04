const express = require("express");
const boardRoutes = require("./board-routes");
const authRoutes = require("./auth-routes");
const collaboratorRoutes = require("./collaborator-routes");
const inviteRoutes = require("./invite-routes");

const router = express.Router();

// Auth routes
router.use("/auth", authRoutes);

// Board routes
router.use("/boards", boardRoutes);

// Collaborator routes
router.use("/collaborators", collaboratorRoutes);

// Invite routes
router.use("/invites", inviteRoutes);

module.exports = router;
