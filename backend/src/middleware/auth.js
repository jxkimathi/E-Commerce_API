// JWT Verification middleware
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authenticate = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not token, authorization denied!' });
  }
  const secretKey = process.env.JWT_SECRET;

  try {
    // Verify token and decode the payload
    const decoded = jwt.verify(token, secretKey);

    // Get user email from the payload
    const userEmail = decoded.email;

    // Find user by email in the database
    const user = await userModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(401).json({ error: "User does not exist!" });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;