const express = require("express");
const { getAllBoards, getBoardById } = require("../controllers/boards");

const router = express.Router();

// getting all boards of a specific user
router.get("/boards", getAllBoards);

// getting boards by a specific id
router.get("/boards/:id", getBoardById);

module.exports = router;
