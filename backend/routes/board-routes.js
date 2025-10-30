const express = require("express");
const { getAllBoards, getBoardById } = require("../controllers/boards");

const router = express.Router();

// getting all boards of a specific user
router.get("/", getAllBoards);

// getting boards by a specific id
router.get("/:id", getBoardById);

module.exports = router;
