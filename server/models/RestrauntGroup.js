import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        required: true,
      },
    ],

    directKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    groupAdmin: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

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
