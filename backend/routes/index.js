const express = require("express");
const boardRoutes = require("./board-routes");

const router = express.Router();

router.use("/boards", boardRoutes);

module.exports = router;
