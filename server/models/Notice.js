import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    // 👇 Which restaurant this notice belongs to
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: 5000,
    },

    // Visual priority
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
      index: true,
    },

    // Control visibility
    isPinned: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// 👇 The main query index — scoped per restaurant
noticeSchema.index({ restaurant: 1});

export default mongoose.model('Notice', noticeSchema);