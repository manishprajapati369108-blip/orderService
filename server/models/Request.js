import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
 {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now(),
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },

);

joinRequestSchema.index({ conversation: 1, user: 1 }, { unique: true });

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);
export default JoinRequest;
