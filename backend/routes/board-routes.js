const express = require("express");
const { getAllBoards } = require("../controllers/boards");

const router = express.Router();

// GET /boards - Get all boards for a user
router.get("/boards", getAllBoards);

module.exports = router;
