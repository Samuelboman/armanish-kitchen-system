import DeliveryArea from "../models/DeliveryArea.js";

const fail = (res, error) => {
  if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message });
  if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid area ID" });
  return res.status(500).json({ success: false, message: error.message });
};

// GET /api/delivery-areas: public, only areas currently offered
export const getActiveAreas = async (req, res) => {
  try {
    const areas = await DeliveryArea.find({ active: true }).sort("name");
    res.status(200).json({ success: true, data: areas });
  } catch (error) {
    fail(res, error);
  }
};

// GET /api/delivery-areas/all: admin, includes switched-off areas
export const getAllAreas = async (req, res) => {
  try {
    const areas = await DeliveryArea.find().sort("name");
    res.status(200).json({ success: true, data: areas });
  } catch (error) {
    fail(res, error);
  }
};

// POST /api/delivery-areas: admin
export const createArea = async (req, res) => {
  try {
    const { name, fee, active } = req.body;
    const area = await DeliveryArea.create({ name, fee, active });
    res.status(201).json({ success: true, data: area });
  } catch (error) {
    fail(res, error);
  }
};

// PUT /api/delivery-areas/:id: admin (also used by the on/off switch, which sends only { active })
export const updateArea = async (req, res) => {
  try {
    // Only copy the fields we allow, so nobody can slip other fields into the update.
    const updates = {};
    for (const key of ["name", "fee", "active"]) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const area = await DeliveryArea.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!area) return res.status(404).json({ success: false, message: "Area not found" });
    res.status(200).json({ success: true, data: area });
  } catch (error) {
    fail(res, error);
  }
};

// DELETE /api/delivery-areas/:id: admin
export const deleteArea = async (req, res) => {
  try {
    const area = await DeliveryArea.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: "Area not found" });
    res.status(200).json({ success: true, data: area });
  } catch (error) {
    fail(res, error);
  }
};