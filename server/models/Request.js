import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
 {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    name : {
      type: String,
      default: null
    },

    image : {
      type: String,
      default: null
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
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
      ref: "Participant",
    },

    receiver : [
      {
        user : {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Participant",
          required: true
        },
        isRead: {
          type: Boolean,
          default: false,
        },

        readAt: {
          type: Date,
          default: null,
        }
      }
    ],

    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },

);

joinRequestSchema.index({ conversation: 1, user: 1 }, { unique: true });

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);
export default JoinRequest;
