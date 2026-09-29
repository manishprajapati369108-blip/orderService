import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },

    // Snapshots — so the bill stays correct even if the menu changes
    name: { type: String, required: true },
    variantName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },

    specialInstructions: String,

    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'],
      default: 'pending',
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },

    tableNumber: { type: Number, required: true, index: true },

    // Guest identity from localStorage
    guestId: { type: String, required: true, index: true },
    guestName: String,

    // True if this guest already ordered at this table
    isReorder: { type: Boolean, default: false },

    Message: { type: String, default: false},

    items: {
      type: [orderItemSchema],
      validate: (v) => v.length > 0,
    },

    subtotal: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'],
      default: 'pending',
      index: true,
    },

    notes: String,
  },
  { timestamps: true }
);

// Auto order number
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });
    this.orderNumber = `ORD-${ymd}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

orderSchema.index({ tableNumber: 1, status: 1 });
orderSchema.index({ tableNumber: 1, guestId: 1, createdAt: 1 });

export default mongoose.model('Order', orderSchema);