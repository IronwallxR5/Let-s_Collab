const express = require("express");
const {
  sendInvite,
  getPendingInvites,
  getBoardInvites,
  acceptInvite,
  declineInvite,
  cancelInvite,
} = require("../controllers/invites");

const router = express.Router();

// send invite for a board (owner only)
router.post("/board/:boardId", sendInvite);

// get my pending invites
router.get("/pending", getPendingInvites);

// get all invites for a board (owner only)
router.get("/board/:boardId", getBoardInvites);

// accept invite
router.patch("/:inviteId/accept", acceptInvite);

// decline invite
router.patch("/:inviteId/decline", declineInvite);

// cancel/delete invite (owner only)
router.delete("/:inviteId", cancelInvite);

module.exports = router;
