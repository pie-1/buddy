// server/models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date, default: null },
    venue: { type: String, required: true, trim: true },
    location: {
      address: { type: String, trim: true },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    department: { type: String, trim: true, default: "All" },
    college: { type: String, trim: true, default: "All" },
    capacity: { type: Number, default: null, min: 0 },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rsvps: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["going", "interested"], default: "going" },
        rsvpAt: { type: Date, default: Date.now },
      },
    ],
    coverImage: { type: String, default: null },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", description: "text", venue: "text" });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ department: 1, college: 1 });
eventSchema.index({ createdAt: -1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;