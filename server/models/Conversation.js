// server/models/Conversation.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    contextType: {
      type: String,
      enum: ["listing", "event", "project", "roommate", "direct"],
      required: true,
    },
    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    lastMessage: {
      text: { type: String, default: "" },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      at: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: ["open", "archived"],
      default: "open",
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ contextType: 1, contextId: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;