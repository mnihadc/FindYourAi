const express = require("express");
const {
  getLoginPage,
  SignUp,
  Login,
} = require("../controllers/auth.controller");
const router = express.Router();

router.get("/login", getLoginPage);
router.post("/signup", SignUp);
router.post("/login", Login);

module.exports = router;
