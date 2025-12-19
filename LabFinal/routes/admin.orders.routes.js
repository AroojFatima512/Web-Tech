const express = require("express");
const Order = require("../models/order.model");
const { adminOnly } = require("../middleware/cart.middleware");

const router = express.Router();

router.get("/admin/orders", adminOnly, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render("admin/orders", { orders });
});

router.post("/admin/orders/:id/confirm", adminOnly, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "Confirmed" });
  res.redirect("/admin/orders");
});

router.post("/admin/orders/:id/cancel", adminOnly, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: "Cancelled" });
  res.redirect("/admin/orders");
});
router.get("/admin/orders", (req, res, next) => {

  // TEMP ADMIN SESSION SET (for project without login)
  if (!req.session.admin) {
    req.session.admin = true;
  }

  next();
}, adminOnly, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render("admin/orders", { orders });
});

module.exports = router;
