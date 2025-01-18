// Authentication Routes (/login, /signup)
const express = require("express");
const { signUp, login } = require("../controllers/authControllers");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/authenticate", authenticate);

module.exports = router;
