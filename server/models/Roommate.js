// server/models/Roommate.js
import mongoose from "mongoose";

const roommateSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["have-room", "looking-for-room"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    bio: { type: String, default: "" },

    // Room details (mostly for have-room, but tenants may still post these when sharing)
    rent: { type: Number, default: 0, min: 0 },
    area: { type: String, required: true, trim: true },
    location: {
      address: { type: String, trim: true },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    roomType: {
      type: String,
      enum: ["single", "shared", "entire-flat"],
      default: "single",
    },
    genderPreference: {
      type: String,
      enum: ["any", "male", "female"],
      default: "any",
    },
    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"],
      default: "unfurnished",
    },
    amenities: [{ type: String }],

    // Looking-for-room specific
    budgetMin: { type: Number, default: null },
    budgetMax: { type: Number, default: null },
    preferredAreas: [{ type: String }],
    sleepSchedule: {
      type: String,
      enum: ["early-bird", "night-owl", "flexible"],
      default: "flexible",
    },
    cleanliness: {
      type: String,
      enum: ["very-clean", "average", "relaxed"],
      default: "average",
    },

    moveInDate: { type: Date, required: true },
    leaseDuration: { type: String, default: "flexible" },
    photos: [{ type: String }],

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "filled", "hidden"],
      default: "available",
    },
  },
  { timestamps: true }
);

roommateSchema.index({ title: "text", description: "text", area: "text", bio: "text" });
roommateSchema.index({ kind: 1, status: 1, area: 1, rent: 1 });
roommateSchema.index({ genderPreference: 1 });
roommateSchema.index({ createdAt: -1 });

const Roommate = mongoose.model("Roommate", roommateSchema);
export default Roommate;