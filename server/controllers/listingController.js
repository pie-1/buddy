import Listing from "../models/Listing.js";
import { awardTrust } from "../utils/trustScore.js";

export const createListing = async (req, res) => {
  try {
    const { title, description, category, price, rentPeriod, returnDeadline, condition, images } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ message: "title, description, category, and price are required" });
    }

    if (!["sell", "rent"].includes(category)) {
      return res.status(400).json({ message: "category must be 'sell' or 'rent'" });
    }

    const isRent = category === "rent";

    const listing = await Listing.create({
      title,
      description,
      category,
      price,
      rentPeriod: isRent ? (rentPeriod || "day") : null,
      returnDeadline: isRent && returnDeadline ? new Date(returnDeadline) : null,
      condition: condition || "good",
      images: images || [],
      sellerId: req.user._id,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    const filter = { status: "active" };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const now = new Date();

    let listings = await Listing.find(filter)
      .populate("sellerId", "name university trustScore isAlumni spotlightUntil department skills")
      .limit(100);

    listings.sort((a, b) => {
      const aSpot = a.sellerId?.spotlightUntil && a.sellerId.spotlightUntil > now ? 1 : 0;
      const bSpot = b.sellerId?.spotlightUntil && b.sellerId.spotlightUntil > now ? 1 : 0;
      return bSpot - aSpot;
    });

    if (sort === "price-asc") listings.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") listings.sort((a, b) => b.price - a.price);
    else listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("sellerId", "name university trustScore isAlumni graduationYear department skills isVerified");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this listing" });
    }

    const editable = ["title", "description", "category", "price", "rentPeriod", "returnDeadline", "condition", "images"];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) listing[field] = req.body[field];
    });

    if (listing.category !== "rent") {
      listing.rentPeriod = null;
      listing.returnDeadline = null;
    }

    const updated = await listing.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const OWNER_SETTABLE = ["active", "sold", "rented", "hidden"];

    if (!OWNER_SETTABLE.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${OWNER_SETTABLE.join(", ")}` });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to change this listing" });
    }

    const previousStatus = listing.status;
    listing.status = status;
    await listing.save();

    const wasClosed = ["sold", "completed"].includes(previousStatus);
    const isClosed = ["sold", "completed"].includes(status);
    if (!wasClosed && isClosed) {
      await awardTrust(listing.sellerId, "LISTING_SOLD");
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};