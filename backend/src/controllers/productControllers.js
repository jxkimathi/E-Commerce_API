// CRUD operations for products
const productModel = require("../models/productModel");

// Fetch available products
const readProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json({ success: true, data: products });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error on reading products!" });
  }
};

// Fetch one product
const readProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: "Product ID required!"});
    }

    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    return res.status(200).json({ success: true, data: product });
  
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error on reading product!" });
  }
}

// Create a new product
const createProduct = async (req, res) => {
  try{
    const product = await productModel.create({ ...req.body });
    return res.status(201).json({ success: true, data: product });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error on creating product!"});
  }
}

// Update a product
const updateProduct = async (req, res) => {
  try{
    const { id } = req.params;
    const updatedData = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    // Validate request body
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ success: false, message: "No update data provided" });
    }

    // Update the product and display the new data
    const product = await productModel.findByIdAndUpdate(id, updatedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }
    return res.status(200).json({ success: true, data: product});

  } catch (error) {
    console.error(`Update Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error on updating product!"});
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try{
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }
    return res.status(200).json({ success: true, data: {} });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error on deleting product!"});
  }
};

module.exports = { readProducts, readProduct, createProduct, updateProduct, deleteProduct };
