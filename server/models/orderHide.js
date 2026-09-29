import mongoose from 'mongoose';

const orderHideSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hiddenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A user can only hide an order once
orderHideSchema.index({ order: 1, userId: 1 }, { unique: true });

// Auto-delete hides after 30 days
orderHideSchema.index(
  { hiddenAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

export default mongoose.model('OrderHide', orderHideSchema);