// server/models/HelpPost.js
import mongoose from "mongoose";

const helpPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

helpPostSchema.index({ status: 1, createdAt: -1 });
helpPostSchema.index({ tags: 1 });
helpPostSchema.index({ title: "text", description: "text" });

const HelpPost = mongoose.model("HelpPost", helpPostSchema);
export default HelpPost;