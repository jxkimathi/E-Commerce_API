// Admin role verification
const userModel = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized as admin" });
    }

    // User is admin, proceed
    next();

  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ success: false, message: "Internal server error in admin verification" });
  }
};

module.exports = isAdmin;
