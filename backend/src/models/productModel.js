// Product schema with fields like name, price, description, stock
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name']
    },

    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be less than 0']
    },

    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxLength: [500, 'Description cannot be more than 500 characters']
    },

    category: {
      type: String,
      required: [true, 'Please provide a product category']
    },

    stock: {
      type: Number,
      required: [true, 'Please provide a product stock'],
      min: [0, 'Stock cannot be less than 0']
    }
  }
);

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
  