// server/controllers/listingController.js
import Listing from "../models/Listing.js";

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
    const { category, search, sort } = req.query;
    const filter = { status: "active" };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const sortBy = sort === "price-asc" ? { price: 1 } : sort === "price-desc" ? { price: -1 } : { createdAt: -1 };

    const listings = await Listing.find(filter)
      .populate("sellerId", "name university trustScore isAlumni")
      .sort(sortBy)
      .limit(100);

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