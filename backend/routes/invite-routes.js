const express = require("express");
const {
  sendInvite,
  getPendingInvites,
} = require("../controllers/invites");

const router = express.Router();

// send invite for a board (owner only)
router.post("/board/:boardId", sendInvite);

// get my pending invites
router.get("/pending", getPendingInvites);

module.exports = router;
