const express = require("express");
const {
  getCollaborators,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
} = require("../controllers/collaborators");

const router = express.Router();

// get all collaborators for a board
router.get("/board/:boardId", getCollaborators);

// add collaborator to board (owner only)
router.post("/board/:boardId", addCollaborator);

// remove collaborator from board (owner only)
router.delete("/:collaboratorId", removeCollaborator);

// update collaborator role (owner only)
router.patch("/:collaboratorId", updateCollaboratorRole);

module.exports = router;
