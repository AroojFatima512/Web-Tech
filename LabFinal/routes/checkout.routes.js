router.post(
  "/checkout",
  checkCartNotEmpty,
  async (req, res) => {
    const { customerName, email } = req.body;

    const cart = req.session.cart;

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      customerName,
      email,
      items: cart,
      totalAmount: total,
    });

    await order.save();

    req.session.cart = [];

    res.redirect(`/order-confirmation/${order._id}`);
  }
);
