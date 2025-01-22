// Authentication Routes (/login, /signup)
const express = require("express");
const { signUp, login, registerAdmin } = require("../controllers/authControllers");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/register-admin", registerAdmin);
router.get("/is-admin", authenticate, isAdmin);
router.get("/authenticate", authenticate);

module.exports = router;
