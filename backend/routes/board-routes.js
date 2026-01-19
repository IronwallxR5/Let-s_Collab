const express = require("express");
const {
  getAllBoards,
  getBoardById,
  deleteBoard,
  createBoard,
  updateBoard
} = require("../controllers/boards");
const { cacheMiddleware, invalidateCache } = require("../middleware/cache");

const router = express.Router();

// getting all boards of a specific user (cached for 5 minutes)
router.get("/", cacheMiddleware("boards:user", 300), getAllBoards);

// getting boards by a specific id (cached for 10 minutes)
router.get("/:id", cacheMiddleware("board:id", 600), getBoardById);

// delete board (owner only) - invalidate cache
router.delete("/:id", invalidateCache(["board:id:*", "boards:user:*"]), deleteBoard);

// create board - invalidate cache
router.post("/", invalidateCache(["boards:user:*"]), createBoard);

// update board - invalidate cache
router.patch("/:id", invalidateCache(["board:id:*", "boards:user:*"]), updateBoard);

module.exports = router;
