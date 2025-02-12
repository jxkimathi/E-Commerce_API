// MongoDB connection configuration
require('dotenv').config()
const mongoose = require('mongoose');

// Connecting to MongoDB
const connectDB = async () => {
  try {
    // Check if MONGOBD_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined!");
    }

    // Connect to the MongoDB Database
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;

  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
}

module.exports = connectDB;
