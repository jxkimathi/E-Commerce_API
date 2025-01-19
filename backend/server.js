// Set up an express server
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/auth");
const productRoutes = require("./src/routes/product");


const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  optionSuccessStatus: 200
};

// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Set up a Database connection
connectDB();

// Route Handlers
app.get('/home', (req, res) => {
  res.status(200).json("You are welcome!");
})

// User Routes
app.use('/api/auth/', userRoutes);

// Cart Routes

// Order Routes

// Product Routes
app.use('/api/products/', productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
