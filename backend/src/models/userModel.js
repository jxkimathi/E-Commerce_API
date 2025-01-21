// Create the User Model Schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name']
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
      minlength: 8
    },
    
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
  
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
