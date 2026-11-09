// server/models/Listing.js
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["buy", "sell", "rent", "borrow"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    rentPeriod: {
      type: String,
      enum: ["day", "week", "month", null],
      default: null,
    },
    returnDeadline: { type: Date, default: null },
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "poor"],
      default: "good",
    },
    images: [{ type: String }],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "requested", "sold", "completed", "hidden"],
      default: "active",
    },
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", description: "text" });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;