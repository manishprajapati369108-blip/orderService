import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },

    name:      { type: String, required: true },
    variety:   { type: String, required: true },
    label:     { type: String, required: true },

    unitPrice: { type: Number, required: true, min: 0 },
    quantity:  { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    guestToken: { type: String, required: true, index: true },
    deviceId:   { type: String, index: true },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },

    subtotal: { type: Number, required: true, min: 0 },
    tax:      { type: Number, default: 0, min: 0 },
    total:    { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },

    orderStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;