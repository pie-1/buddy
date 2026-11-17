import Roommate from "../models/Roommate.js";

const MAP_URL = /^https?:\/\/(www\.)?(google\.(com|co\.[a-z]{2})\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/i;

function normalizeLocation(input) {
  if (!input?.raw || typeof input.raw !== "string") return { raw: "" };
  const raw = input.raw.trim();
  if (!MAP_URL.test(raw)) return null;
  return { raw };
}

export const createRoommate = async (req, res) => {
  try {
    const {
      kind, title, description, bio,
      rent, area, location, roomType, genderPreference, furnishing, amenities,
      budgetMin, budgetMax, preferredAreas, sleepSchedule, cleanliness,
      moveInDate, leaseDuration, photos,
    } = req.body;

    if (!kind || !["have-room", "looking-for-room"].includes(kind)) {
      return res.status(400).json({ message: "kind must be 'have-room' or 'looking-for-room'" });
    }
    if (!title || !description || !area || !moveInDate) {
      return res.status(400).json({ message: "title, description, area, and moveInDate are required" });
    }
    if (kind === "have-room" && (rent === undefined || rent === null)) {
      return res.status(400).json({ message: "rent is required for have-room listings" });
    }

    const loc = normalizeLocation(location);
    if (loc === null) {
      return res.status(400).json({ message: "Location must be a Google Maps link" });
    }

    const roommate = await Roommate.create({
      kind,
      title,
      description,
      bio: bio || "",
      rent: rent ?? 0,
      area,
      location: loc,
      roomType: roomType || "single",
      genderPreference: genderPreference || "any",
      furnishing: furnishing || "unfurnished",
      amenities: amenities || [],
      budgetMin: budgetMin ?? null,
      budgetMax: budgetMax ?? null,
      preferredAreas: preferredAreas || [],
      sleepSchedule: sleepSchedule || "flexible",
      cleanliness: cleanliness || "average",
      moveInDate,
      leaseDuration: leaseDuration || "flexible",
      photos: photos || [],
      postedBy: req.user._id,
    });

    res.status(201).json(roommate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRoommates = async (req, res) => {
  try {
    const { kind, area, minRent, maxRent, gender, roomType, search, sort } = req.query;
    const filter = { status: "available" };

    if (kind && ["have-room", "looking-for-room"].includes(kind)) {
      filter.kind = kind;
    }
    if (area) filter.area = { $regex: area, $options: "i" };
    if (gender && gender !== "any") {
      filter.genderPreference = { $in: ["any", gender] };
    }
    if (roomType) filter.roomType = roomType;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }
    if (search) filter.$text = { $search: search };

    const now = new Date();

    const roommates = await Roommate.find(filter)
      .populate("postedBy", "name university trustScore graduationYear spotlightUntil")
      .sort({ createdAt: -1 })
      .limit(100);

    roommates.sort((a, b) => {
      const aSpot = a.postedBy?.spotlightUntil && a.postedBy.spotlightUntil > now ? 1 : 0;
      const bSpot = b.postedBy?.spotlightUntil && b.postedBy.spotlightUntil > now ? 1 : 0;
      if (aSpot !== bSpot) return bSpot - aSpot;
      if (sort === "rent-asc") return a.rent - b.rent;
      if (sort === "rent-desc") return b.rent - a.rent;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(roommates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoommateById = async (req, res) => {
  try {
    const roommate = await Roommate.findById(req.params.id)
      .populate("postedBy", "name university trustScore graduationYear spotlightUntil");
    if (!roommate) return res.status(404).json({ message: "Roommate profile not found" });
    res.json(roommate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoommate = async (req, res) => {
  try {
    const roommate = await Roommate.findById(req.params.id);
    if (!roommate) return res.status(404).json({ message: "Roommate profile not found" });

    if (roommate.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this profile" });
    }

    const editable = [
      "title", "description", "bio", "rent", "area", "roomType",
      "genderPreference", "furnishing", "amenities", "budgetMin", "budgetMax",
      "preferredAreas", "sleepSchedule", "cleanliness", "moveInDate", "leaseDuration",
      "photos", "status",
    ];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) roommate[field] = req.body[field];
    });

    if (req.body.location !== undefined) {
      const loc = normalizeLocation(req.body.location);
      if (loc === null) {
        return res.status(400).json({ message: "Location must be a Google Maps link" });
      }
      roommate.location = loc;
    }

    const updated = await roommate.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoommate = async (req, res) => {
  try {
    const roommate = await Roommate.findById(req.params.id);
    if (!roommate) return res.status(404).json({ message: "Roommate profile not found" });

    if (roommate.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this profile" });
    }

    await roommate.deleteOne();
    res.json({ message: "Roommate profile removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};