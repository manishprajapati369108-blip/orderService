import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    variety: {
      type: String,
      required: true,
      enum: ["pieces", "small", "medium", "large", "weight", "regular", "half", "full", "family"],
    },
    label: { type: String, required: true },   // "Small (6\")", "6 pieces", "500g"
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    inStock:   { type: Boolean, default: true },
    stock:     { type: Number, default: 0, min: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    description: {
        type: String,
        default:null,
    },

    category:    { type: String, required: true, index: true },
    subCategory: { type: String, default: null, index: true },

    variants: {
      type: [variantSchema],
      validate: [(v) => v.length > 0, "At least one variant required"],
    },

    available: { type: Boolean, default: true, index: true }, // whole product on/off
    active:    { type: Boolean, default: true, index: true },

   
  },
  { timestamps: true }
);

productSchema.index({ restaurant: 1, category: 1, available: 1, active: 1 });
productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;