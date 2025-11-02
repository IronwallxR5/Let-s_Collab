const express = require("express");
const {
  getAllBoards,
  getBoardById,
  deleteBoard,
} = require("../controllers/boards");

const router = express.Router();

// getting all boards of a specific user
router.get("/", getAllBoards);

// getting boards by a specific id
router.get("/:id", getBoardById);

// delete board (owner only)
router.delete("/:id", deleteBoard);

module.exports = router;
