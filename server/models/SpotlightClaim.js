// server/models/SpotlightClaim.js
import mongoose from "mongoose";

const spotlightClaimSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, default: 50 },
    txnId: { type: String, required: true, trim: true },
    screenshot: { type: String, required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

spotlightClaimSchema.index({ userId: 1, createdAt: -1 });
spotlightClaimSchema.index({ status: 1, weekStart: 1 });
spotlightClaimSchema.index({ weekStart: 1, status: 1 });

const SpotlightClaim = mongoose.model("SpotlightClaim", spotlightClaimSchema);
export default SpotlightClaim;