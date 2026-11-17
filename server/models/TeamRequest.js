import mongoose from "mongoose";

const teamRequestSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    posterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamName: { type: String, required: true, trim: true },
    pitch: { type: String, required: true },
    department: { type: String, default: "Any" },
    rolesNeeded: [{ type: String, trim: true }],
    skillTags: [{ type: String, trim: true }],
    spotsAvailable: { type: Number, default: 1, min: 1 },
    contactPreference: { type: String, default: "in-app chat" },
    applicants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        message: { type: String, default: "" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["open", "filled", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

teamRequestSchema.index({ eventId: 1, status: 1, createdAt: -1 });
teamRequestSchema.index({ skillTags: 1 });

const TeamRequest = mongoose.model("TeamRequest", teamRequestSchema);
export default TeamRequest;