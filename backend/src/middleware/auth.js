// JWT Verification middleware
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
  
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header required!" });
    }

    const token =  authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: 'Not token, authorization denied!' });
    }
    const secretKey = process.env.JWT_SECRET;

    // Verify token and decode the payload
    const decoded = jwt.verify(token, secretKey);

    // Find user by id
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User does not exist!" });
    }

    // Attach user to request object
    req.user = user;
    res.status(201).json({ success: true, message: "User authenticated!" });
    next();

  } catch (error) {
    console.log(`Auth Error: ${error}`);
    return res.status(401).json({ error: "Please Authenticate!" });
  }
};

module.exports = authenticate;
