// server/models/Roommate.js
import mongoose from "mongoose";

const roommateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    rent: { type: Number, required: true, min: 0 },
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

roommateSchema.index({ title: "text", description: "text", area: "text" });
roommateSchema.index({ status: 1, area: 1, rent: 1 });
roommateSchema.index({ genderPreference: 1 });
roommateSchema.index({ createdAt: -1 });

const Roommate = mongoose.model("Roommate", roommateSchema);
export default Roommate;