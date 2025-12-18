const express = require("express");
const Product = require("../models/product.model");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const category = req.query.category;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (minPrice && maxPrice) {
    filter.price = { $gte: minPrice, $lte: maxPrice };
  }

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  res.json({
    total,
    page,
    products
  });
});

module.exports = router;
