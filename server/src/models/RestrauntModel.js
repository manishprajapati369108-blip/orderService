import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, index: true },
    address: { type: String, default: "" },
    active:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: "text" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;