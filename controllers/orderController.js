import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

// POST /api/orders — create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, customerName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    // Look up each menu item's real price from the database —
    // never trust a price sent from the frontend, since it could be tampered with.
    let totalPrice = 0;
    for (const orderItem of items) {
      const menuItem = await MenuItem.findById(orderItem.menuItem);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item not found: ${orderItem.menuItem}` });
      }
      totalPrice += menuItem.price * (orderItem.quantity || 1);
    }

    const order = await Order.create({
      items,
      customerName,
      totalPrice,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};  

// GET /api/orders — fetch all orders (admin only)
    // .populate() automatically fills in each order's referenced MenuItem
// details (name, price, etc.) instead of just showing raw IDs.

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menuItem");
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
  res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id — fetch a single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.menuItem");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};