import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import DeliveryArea from "../models/DeliveryArea.js";
import User from "../models/User.js";
import { getIO } from "../config/socket.js";

const MAX_LINES = 30;
const MAX_QUANTITY = 50;

// Errors always look like { success: false, code, message }: his frontend decides what to show from the code.
const fail = (res, status, code, message, extra = {}) =>
  res.status(status).json({ success: false, code, message, ...extra });

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const tokenMatches = (token, storedHash) => {
  if (typeof token !== "string" || !storedHash) return false;
  const a = Buffer.from(hashToken(token), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// Fields are listed one by one on purpose, so nothing private can leak by accident.
const fullOrder = (o) => ({
  _id: o._id,
  customerName: o.customerName,
  orderType: o.orderType,
  deliveryAreaName: o.deliveryAreaName,
  deliveryAddress: o.deliveryAddress,
  items: o.items.map((i) => ({
    _id: i._id,
    name: i.name,
    accompaniment: i.accompaniment,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
  })),
  subtotal: o.subtotal,
  deliveryFee: o.deliveryFee,
  totalPrice: o.totalPrice,
  status: o.status,
  createdAt: o.createdAt,
});

// What someone sees without the order token: no name, no address.
const summaryOrder = (o) => {
  const order = fullOrder(o);
  delete order.customerName;
  delete order.deliveryAddress;
  return order;
};

// POST /api/orders: anyone can order (guest checkout)
export const createOrder = async (req, res) => {
  try {
    const { customerName, orderType, deliveryArea, deliveryAddress, items } = req.body;

    const name = typeof customerName === "string" ? customerName.trim() : "";
    if (!name) return fail(res, 400, "NAME_REQUIRED", "Please enter your name");
    if (!["delivery", "pickup"].includes(orderType)) {
      return fail(res, 400, "ORDER_TYPE_REQUIRED", "Choose delivery or pickup");
    }

    let area = null;
    let address = "";
    if (orderType === "delivery") {
      if (!deliveryArea) return fail(res, 400, "AREA_REQUIRED", "Choose a delivery area");
      area = mongoose.isValidObjectId(deliveryArea) ? await DeliveryArea.findById(deliveryArea) : null;
      if (!area || !area.active) {
        return fail(res, 400, "AREA_UNAVAILABLE", "We don't deliver to that area right now");
      }
      address = typeof deliveryAddress === "string" ? deliveryAddress.trim() : "";
      if (!address) return fail(res, 400, "ADDRESS_REQUIRED", "Please enter your delivery address");
    }

    if (!Array.isArray(items) || items.length === 0) {
      return fail(res, 400, "NO_ITEMS", "Your cart is empty");
    }
    if (items.length > MAX_LINES) {
      return fail(res, 400, "TOO_MANY_ITEMS", "That is too many different items for one order");
    }
    for (const entry of items) {
      if (!entry || !mongoose.isValidObjectId(entry.menuItem)) {
        return fail(res, 400, "INVALID_ITEM", "One of the items in your cart isn't valid");
      }
      const quantity = Number(entry.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return fail(res, 400, "INVALID_QUANTITY", `Quantity must be between 1 and ${MAX_QUANTITY}`);
      }
    }

    // One database query for the whole cart, instead of one per item
    const ids = [...new Set(items.map((entry) => String(entry.menuItem)))];
    const found = await MenuItem.find({ _id: { $in: ids } });
    const byId = new Map(found.map((m) => [String(m._id), m]));

    let subtotal = 0;
    const lines = [];
    for (const entry of items) {
      const menuItem = byId.get(String(entry.menuItem));
      if (!menuItem) {
        return fail(res, 400, "ITEM_NOT_FOUND", "An item in your cart is no longer on the menu", {
          menuItem: String(entry.menuItem),
        });
      }
      if (!menuItem.available) {
        return fail(res, 400, "ITEM_UNAVAILABLE", `${menuItem.name} isn't available right now`, {
          menuItem: String(menuItem._id),
        });
      }

      const options = menuItem.accompaniments ?? [];
      const accompaniment = typeof entry.accompaniment === "string" ? entry.accompaniment : "";
      const optionOk = options.length > 0 ? options.includes(accompaniment) : accompaniment === "";
      if (!optionOk) {
        return fail(res, 400, "INVALID_OPTION", `Please choose a valid option for ${menuItem.name}`, {
          menuItem: String(menuItem._id),
        });
      }

      const quantity = Number(entry.quantity);
      subtotal += menuItem.price * quantity;
      lines.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        unitPrice: menuItem.price,
        accompaniment,
        quantity,
      });
    }

    const deliveryFee = area ? area.fee : 0;
    const accessToken = crypto.randomBytes(24).toString("hex");

    const order = await Order.create({
      items: lines,
      customerName: name,
      orderType,
      deliveryArea: area ? area._id : null,
      deliveryAreaName: area ? area.name : "",
      deliveryAddress: address,
      subtotal,
      deliveryFee,
      totalPrice: subtotal + deliveryFee,
      accessTokenHash: hashToken(accessToken),
    });

    // The token is shown only this once; the database keeps just its hash.
    res.status(201).json({ success: true, data: { ...fullOrder(order), accessToken } });
  } catch (error) {
    fail(res, 500, "SERVER_ERROR", "Something went wrong placing your order");
  }
};

// GET /api/orders: admin, newest first. ?limit=N (default 50, max 200)
export const getAllOrders = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
    const orders = await Order.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json({ success: true, count: orders.length, data: orders.map(fullOrder) });
  } catch (error) {
    fail(res, 500, "SERVER_ERROR", "Could not load orders");
  }
};

// GET /api/orders/:id: full details only with the right X-Order-Token header
export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid order ID");
    }
    const order = await Order.findById(req.params.id).select("+accessTokenHash");
    if (!order) return fail(res, 404, "ORDER_NOT_FOUND", "Order not found");

    const allowed = tokenMatches(req.get("X-Order-Token"), order.accessTokenHash);
    res.status(200).json({ success: true, data: allowed ? fullOrder(order) : summaryOrder(order) });
  } catch (error) {
    fail(res, 500, "SERVER_ERROR", "Could not load the order");
  }
};

// PUT /api/orders/:id/assign-rider: admin
export const assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    const rider = mongoose.isValidObjectId(riderId) ? await User.findById(riderId) : null;
    if (!rider || rider.role !== "rider") return fail(res, 400, "INVALID_RIDER", "Invalid rider ID");

    const existing = await Order.findById(req.params.id);
    if (!existing) return fail(res, 404, "ORDER_NOT_FOUND", "Order not found");
    if (existing.orderType === "pickup") {
      return fail(res, 400, "INVALID_STATUS", "Pickup orders don't need a rider");
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedRider: riderId, status: "out_for_delivery" },
      { new: true, runValidators: true }
    ).populate("assignedRider", "name phone"); // only these fields, never the password hash

    getIO().emit(`order-status-${order._id}`, { status: order.status });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    fail(res, 500, "SERVER_ERROR", error.message);
  }
};

// PUT /api/orders/:id/status: admin, or the rider the order is assigned to
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 400, "INVALID_ID", "Invalid order ID");

    const order = await Order.findById(req.params.id);
    if (!order) return fail(res, 404, "ORDER_NOT_FOUND", "Order not found");

    if (req.user.role === "rider" && String(order.assignedRider) !== req.user.id) {
      return fail(res, 403, "NOT_ASSIGNED", "This order is not assigned to you");
    }
    if (status === "out_for_delivery" && order.orderType === "pickup") {
      return fail(res, 400, "INVALID_STATUS", "Pickup orders can't be out for delivery");
    }

    // Update just the status (the enum rule still checks it), then tell anyone watching
    const updated = await Order.findByIdAndUpdate(order._id, { status }, { new: true, runValidators: true });
    getIO().emit(`order-status-${updated._id}`, { status: updated.status });

    res.status(200).json({ success: true, data: fullOrder(updated) });
  } catch (error) {
    if (error.name === "ValidationError") return fail(res, 400, "INVALID_STATUS", "That isn't a valid status");
    fail(res, 500, "SERVER_ERROR", error.message);
  }
};