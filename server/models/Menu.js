import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },   // "Half", "Full", "Small", "Large"
  price: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
});

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    image: String,
    category: { type: String, required: true, index: true }, // "Starters", "Mains"

    variants: {
      type: [variantSchema],
      validate: (v) => v.length > 0,
    },

    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);