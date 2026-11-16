// server/models/CollegeRequest.js
import mongoose from "mongoose";

const collegeRequestSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("CollegeRequest", collegeRequestSchema);