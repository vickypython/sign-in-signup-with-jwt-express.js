const express = require("express");
const { signIn, signUp } = require("../controllers/authController.js");
const router = express.Router();
router.post("/register", signUp);
router.post("/login", signIn);
module.exports = router;
