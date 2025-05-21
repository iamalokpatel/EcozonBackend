import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// Place a order
export const placeOrder = async (req, res) => {
  try {
    const { productId, address } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const order = new Order({
      user: req.user._id,
      product: productId,
      address,
    });

    await order.save();

    // await User.findByIdAndUpdate(userId, {
    //   $push: { orders: savedOrder._id },
    // });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// For Cart Order Placed
export const placeCartOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orders = [];

    for (const item of cart.items) {
      const order = new Order({
        user: userId,
        product: item.product._id,
        address,
      });
      await order.save();
      orders.push(order);
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Orders placed successfully", orders });
  } catch (err) {
    console.error("Error placing orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// FIND ALL USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("product");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
