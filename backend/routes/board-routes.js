const express = require("express");
const {
  getAllBoards,
  getBoardById,
  deleteBoard,
  createBoard,
} = require("../controllers/boards");

const router = express.Router();

// getting all boards of a specific user
router.get("/", getAllBoards);

// getting boards by a specific id
router.get("/:id", getBoardById);

// delete board (owner only)
router.delete("/:id", deleteBoard);
router.post("/", createBoard);

module.exports = router;
