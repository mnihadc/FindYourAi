const express = require("express");
const { getLoginPage } = require("../controllers/auth.controller");
const router = express.Router();

router.get("/login", getLoginPage);

module.exports = router;
