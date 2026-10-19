import DeliverySettings from "../models/DeliverySettings.js";
import { quoteDelivery } from "../utils/delivery.js";

const FIELDS = ["kitchenLat", "kitchenLng", "baseFee", "perKmRate", "minFee", "maxDistanceKm", "roadFactor", "roundTo"];

// POST /api/delivery/quote: public. Body: { lat, lng }
export const getQuote = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return res.status(400).json({ success: false, code: "LOCATION_REQUIRED", message: "Choose your delivery location on the map" });
    }
    const settings = await DeliverySettings.findOne();
    if (!settings) {
      return res.status(503).json({ success: false, code: "DELIVERY_NOT_CONFIGURED", message: "Delivery isn't available right now" });
    }
    res.status(200).json({ success: true, data: quoteDelivery(settings, lat, lng) });
  } catch (error) {
    res.status(500).json({ success: false, code: "SERVER_ERROR", message: "Could not work out the delivery fee" });
  }
};

// GET /api/delivery/settings: admin
export const getSettings = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: await DeliverySettings.findOne() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/delivery/settings: admin. Creates the settings the first time.
export const updateSettings = async (req, res) => {
  try {
    const doc = (await DeliverySettings.findOne()) || new DeliverySettings();
    for (const key of FIELDS) {
      if (req.body[key] !== undefined) doc[key] = req.body[key];
    }
    await doc.save(); // save() checks every required field, even on the first run
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, code: "INVALID_SETTINGS", message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};