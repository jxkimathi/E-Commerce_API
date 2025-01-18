// Create the User Model Schema
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Please provide a name']
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true
    },

    password: {
      type: String,
      required: [true, 'Please provide a password']
    },
    
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
