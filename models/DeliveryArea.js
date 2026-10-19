import mongoose from "mongoose";

const deliveryAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Area name is required"], trim: true, maxlenghth: 80 },
      fee: { type: Number, required: [true, "Delivery fee is required"], min: [0, "Delivery fee cannot be negative"] },
      active: { type: Boolean, default: true },
    },
  { timestamps: true }
);

export default mongoose.model("DeliveryArea", deliveryAreaSchema);