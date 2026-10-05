import mongoose from "mongoose";
import generateUid from "../utils/generateId.js";

const conversationSchema = new mongoose.Schema(
  {
    uid: { type: String, default: generateUid, index: true },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        required: true,
      },
    ],

    name: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],

    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
