// server/controllers/listingController.js
import Listing from "../models/Listing.js";
import Conversation from "../models/Conversation.js";
import { calculateCommonGround, getViewerPeers } from "../utils/commonGround.js";

export const createListing = async (req, res) => {
  try {
    const { title, description, category, price, rentPeriod, returnDeadline, condition, images } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ message: "title, description, category, and price are required" });
    }

    const listing = await Listing.create({
      title,
      description,
      category,
      price,
      rentPeriod: rentPeriod || null,
      returnDeadline: returnDeadline || null,
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
    const { category, search, sort, mode } = req.query;
    
    // If mode is 'for-you', they must be logged in
    let viewer = null;
    let viewerPeers = [];
    if (mode === "for-you" && req.user) {
      // We need to fetch the viewer's profile (skills, department) to score properly
      // Note: req.user is usually set by auth middleware. If not, we'd need User.findById
      viewer = req.user; 
      viewerPeers = await getViewerPeers(req.user._id, Conversation);
    }

    const filter = { status: "active" };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const now = new Date();

    // Fetch listings and populate the seller
    let listings = await Listing.find(filter)
      .populate("sellerId", "name university trustScore isAlumni spotlightUntil department skills")
      .limit(100);

    // Spotlight floats to top
    listings.sort((a, b) => {
      const aSpot = a.sellerId?.spotlightUntil && a.sellerId.spotlightUntil > now ? 1 : 0;
      const bSpot = b.sellerId?.spotlightUntil && b.sellerId.spotlightUntil > now ? 1 : 0;
      return bSpot - aSpot;
    });

    if (mode === "for-you" && viewer) {
      // 1. Calculate score for every listing
      const scored = listings.map(listing => {
        const { score, reason } = calculateCommonGround(viewer, listing, listing.sellerId, viewerPeers);
        return { ...listing.toObject(), _cgScore: score, _cgReason: reason };
      });

      // 2. Sort by score descending
      scored.sort((a, b) => b._cgScore - a._cgScore);
      
      return res.json(scored);
    }

    // Default behavior (All)
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
    const listing = await Listing.findById(req.params.id).populate("sellerId", "name university trustScore isAlumni graduationYear");
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

    const editable = ["title", "description", "category", "price", "rentPeriod", "returnDeadline", "condition", "images", "status"];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) listing[field] = req.body[field];
    });

    const updated = await listing.save();
    res.json(updated);
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

