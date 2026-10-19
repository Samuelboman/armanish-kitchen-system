import mongoose from "mongoose";

const deliverySettingsSchema = new mongoose.Schema(
  {
    kitchenLat: { type: Number, required: true, min: -90, max: 90 },
    kitchenLng: { type: Number, required: true, min: -180, max: 180 },
    baseFee: { type: Number, required: true, min: 0 },
    perKmRate: { type: Number, required: true, min: 0 },
    minFee: { type: Number, required: true, min: 0 },
    maxDistanceKm: { type: Number, required: true, min: 0.1 },
    roadFactor: { type: Number, default: 1.3, min: 1, max: 3 }, // roads are longer than a straight line
    roundTo: { type: Number, default: 50, min: 1 }, // round fees up to the nearest 50 naira
  },
  { timestamps: true }
);

export default mongoose.model("DeliverySettings", deliverySettingsSchema);