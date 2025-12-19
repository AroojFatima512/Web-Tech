// ================== IMPORTS ==================
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = 3000;

// ================== DATABASE ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(expressLayouts);

// ================== ROUTES (IMPORT FIRST) ==================
const checkoutRoutes = require("./routes/checkout.routes");
const adminOrderRoutes = require("./routes/admin.orders.routes");

// ================== ROUTES (USE AFTER IMPORT) ==================
app.use("/", checkoutRoutes);
app.use("/", adminOrderRoutes);

// ================== PAGE ROUTES ==================
app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/contactus", (req, res) => {
  res.render("contactus");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.get("/mycheckout", (req, res) => {
  res.render("mycheckout");
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

// ================== SERVER ==================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
