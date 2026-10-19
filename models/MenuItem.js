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
    unit: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
       validate: {
        validator: (v) => v === "" || /^(\/(?!\/)[^\s"'<>]*|https:\/\/[^\s"'<>]+)$/.test(v),
        message: "Image must be empty, a site path like /images/x.jpg, or an https:// link",
      },
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