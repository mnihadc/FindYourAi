const express = require("express");
const { getLoginPage, SignUp } = require("../controllers/auth.controller");
const router = express.Router();

router.get("/login", getLoginPage);
router.post("/signup", SignUp);

module.exports = router;
