const express = require("express");
const { readProducts, readProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/productControllers");
const authenticate = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// CRUD Product routes
router.get("/fetch", readProducts);
router.get("/fetch/:id", readProduct);
router.post("/create", createProduct);
router.put("/update/:id", authenticate, admin, updateProduct);
router.delete("/delete/:id",authenticate, admin, deleteProduct);

module.exports = router;
