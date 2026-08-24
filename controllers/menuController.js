import MenuItem from "../models/MenuItem.js";

// GET /api/menu - fetch allmenu items
export const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET/ api/menu/:id - fetch a single menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
   if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }
  res.status(400).json({ success: false, message: error.message });
  }
};

//POST /api/menu - create a single item
export const createMenuItem = async (req, res) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  }catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({success: false, message: error.message });
    }
    res.status(500).json({success: false, message: error.message });
  }
};

//PUT  /api/menu/:id - update an existing item
export const updateMenuItem = async (req, res) => {
  try {
    const updateItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateItem) {
      return res.status(404).json({ success: false, message: "Menu item is not found" });
    }
    res.status(200).json({ success: true, data: updateItem });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

//DELETE /api/menu/:id - delete an existing item
export const deleteMenuItem = async (req, res) => {
  try {
    const deleteItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    res.status(200).json({ success: true, message: "Menu item deleted", data: deleteItem });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};