import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item",
      },
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"],
      default: "pending",
    },
    assignedRider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;