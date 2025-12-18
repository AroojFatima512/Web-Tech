// install node
// it will install node and npm
// https://nodejs.org/en/download
// test node and npm by running node -v and npm -v in terminal
// run npm init -y to create a package.json file
// install express by running npm install

// in development mode run nodemon server.js
// install nodemon globally by running npm install -g nodemon

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
var expressLayouts = require("express-ejs-layouts");
var ProductModel = require("./models/product.model");
const PORT = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Check connection
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

//expose public folder to the browser
//now we can access files in public folder directly
//http://localhost:3000/contact-us.html
// if static files are in a folder named 'public', use the following line
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(expressLayouts); //  setup layout mechanism

app.get("/contactus", (req, res) => {
  res.render("contactus");
});

app.get("/", (req, res) => {
  res.render("homepage");
});
app.get("/cart", (req, res) => {
  res.render("cart");
});
app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.get("/api", (req, res) => {
  res.render("api");
});

app.get("/buynow", (req, res) => {
  res.render("buynow");
});
app.get("/cv", (req, res) => {
  res.render("cv");
});
app.get("/payment", (req, res) => {
  res.render("payment");
});
app.get("/review", (req, res) => {
  res.render("review");
});

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});