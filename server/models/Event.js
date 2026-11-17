import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coverImage: { type: String, default: null },

    date: { type: Date, required: true },
    endDate: { type: Date, default: null },
    registrationDeadline: { type: Date, default: null },

    venue: { type: String, required: true, trim: true },
    mode: { type: String, enum: ["offline", "online", "hybrid"], default: "offline" },
    location: {
      address: { type: String, trim: true },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    tags: [{ type: String, trim: true }],
    cost: { type: String, default: "Free" },
    registrationLink: { type: String, default: null },
    organizerName: { type: String, trim: true, default: "" },

    department: { type: String, trim: true, default: "All" },
    college: { type: String, trim: true, default: "All" },
    capacity: { type: Number, default: null, min: 0 },

    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    spotlightUntil: { type: Date, default: null },

    rsvps: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["going", "interested"], default: "going" },
        rsvpAt: { type: Date, default: Date.now },
      },
    ],

    status: { type: String, enum: ["upcoming", "ongoing", "completed", "cancelled"], default: "upcoming" },
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", description: "text", venue: "text", tags: "text" });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ spotlightUntil: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;