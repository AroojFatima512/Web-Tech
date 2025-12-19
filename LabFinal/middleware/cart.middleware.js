// Prevent checkout if cart is empty
exports.checkCartNotEmpty = (req, res, next) => {
  if (!req.session.cart || req.session.cart.items.length === 0) {
    return res.redirect("/cart");
  }
  next();
};

// Admin authorization middleware
exports.adminOnly = (req, res, next) => {
  if (req.session.user?.email !== "admin@shop.com") {
    return res.status(403).send("Access denied");
  }
  next();
};

