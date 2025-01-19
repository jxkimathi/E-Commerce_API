// Admin role verification
const userModel = require("../models/userModel");

const isAdmin = (req, res, next) => {
  try{
    if (req.userModel && req.userModel.role === 'admin') {
      next();
    } else {
      res.status(401).json(
        {
          success: false,
          message: "Not authorized as admin!"
        }
      );
    }
  } catch (error) {
    return res.status(500)(
      {
        success: false,
        message: "Internal server error in admin verification!"
      });
  }
};

module.exports = isAdmin;
