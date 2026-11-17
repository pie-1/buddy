import mongoose from "mongoose";

const collegeRequestSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("CollegeRequest", collegeRequestSchema);