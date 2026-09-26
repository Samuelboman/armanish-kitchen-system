import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be negative"],  
    },
    category: {
      type: String,
      enum: ["masa", "yamarita", "drinks", "other"],
      default: "other",
    },
      accompaniments: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    }
  } ,
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;