const express = require("express");

const userRoutes = require("./user");
const fileRoutes = require("./file");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/file", fileRoutes);

module.exports = router;
