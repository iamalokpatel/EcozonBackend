import Cart from "../models/Cart.js";

// Add a Product In Cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex > -1) {
    return res.status(400).json({ message: "Product already in cart" });
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  res.json(cart);
};

// Get all Cart Product
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  res.json(cart || { items: [] });
};

// Remove Product From  Cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const updatedItems = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.items = updatedItems;
    await cart.save();
    res.json({ message: "Item removed successfully", cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
