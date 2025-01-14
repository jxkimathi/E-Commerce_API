// Set up an express server
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const signUp = require("./authentication/signup");
const login = require("./authentication/login");


const app = express();
const port = process.env.PORT || 5000;

// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(bodyParser.json());

// Set up a Database connection
connectDB();

// Route Handlers
app.get('/home', (req, res) => {
  res.status(200).json("You are welcome!");
})

// Register a new user
app.post('/signup', signUp);

// Login a user
app.post('/login', login);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
