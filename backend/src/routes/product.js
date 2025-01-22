const express = require("express");
const { readProducts, readProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/productControllers");
const isAdmin = require("../middleware/admin");
const authenticate = require("../middleware/auth")

const router = express.Router();

// CRUD Product routes
router.get("/fetch", readProducts);
router.get("/fetch/:id", readProduct);
router.post("/create", authenticate, isAdmin, createProduct);
router.put("/update/:id", authenticate,  isAdmin, updateProduct);
router.delete("/delete/:id", authenticate, isAdmin, deleteProduct);

module.exports = router;
