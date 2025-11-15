const express = require("express");
const router = express.Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
