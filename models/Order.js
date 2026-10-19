import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  // Snapshot taken when the order is placed
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true, min: 0 },
  accompaniment: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 1, max: 50 },
});

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item",
      },
    },
    customerName: { type: String, required: [true, "Customer name is required"], trim: true, maxlength: 100 },
    orderType: { type: String, enum: ["delivery", "pickup"], required: true },
    deliveryArea: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryArea", default: null },
    deliveryAreaName: { type: String, default: "" },
    deliveryAddress: { type: String, trim: true, maxlength: 300, default: "" },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"],
      default: "pending",
    },
    assignedRider: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    accessTokenHash: { type: String, select: false }, // never loaded unless asked for
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 }); // the admin list sorts newest first

const Order = mongoose.model("Order", orderSchema);

export default Order;