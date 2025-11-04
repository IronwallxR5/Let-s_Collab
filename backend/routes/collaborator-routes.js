const express = require("express");
const {
  getCollaborators,
  addCollaborator,
  removeCollaborator,
} = require("../controllers/collaborators");

const router = express.Router();

// get all collaborators for a board
router.get("/board/:boardId", getCollaborators);

// add collaborator to board (owner only)
router.post("/board/:boardId", addCollaborator);

// remove collaborator from board (owner only)
router.delete("/:collaboratorId", removeCollaborator);

module.exports = router;
