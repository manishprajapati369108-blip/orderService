import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    guestToken: { type: String, required: true, index: true },
    deviceId: { type: String, index: true },
    guestEmail: { type: String, default: null },

    batchNumber: { type: Number, required: true, min: 1 },
    type: {
      type: String,
      enum: ["first_order", "reorder"],
      default: "first_order",
    },

    orderCount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true },
);

batchSchema.index(
  { restaurant: 1, guestToken: 1, batchNumber: 1 },
  { unique: true },
);

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
