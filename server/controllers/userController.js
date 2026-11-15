// server/controllers/userController.js
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Roommate from "../models/Roommate.js";
import Event from "../models/Event.js";
import TeamRequest from "../models/TeamRequest.js";
import Conversation from "../models/Conversation.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user._id;

    const user = await User.findById(id).select("-password -otp -otpExpires -email");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fan-out queries — all parallelized
    const [listings, roommate, events, teamRequests, mutual] = await Promise.all([
      // Active marketplace listings by this user
      Listing.find({ sellerId: id, status: "active" })
        .sort({ createdAt: -1 })
        .limit(12),

      // Their roommate profile
      Roommate.findOne({ postedBy: id, status: { $ne: "hidden" } })
        .select("-__v"),

      // Events they're going to
      Event.find({ "rsvps.userId": id, "rsvps.status": "going", status: { $in: ["upcoming", "ongoing"] } })
        .select("title date venue coverImage mode tags")
        .sort({ date: 1 })
        .limit(10),

      // Their active team requests
      TeamRequest.find({ posterId: id, status: "open" })
        .populate("eventId", "title date")
        .sort({ createdAt: -1 })
        .limit(10),

      // Mutual connections: users who share a conversation with both viewer and this user
      computeMutual(viewerId, id),
    ]);

    // Update lastSeen for the viewed user
    await User.findByIdAndUpdate(id, { lastSeenAt: new Date() });

    // Derive spotlight state
    const spotlight = {
      active: user.spotlightUntil && user.spotlightUntil > new Date(),
      until: user.spotlightUntil,
    };

    res.json({
      user: {
        ...user.toObject(),
        isAlumni: user.isAlumni,
      },
      listings,
      roommate,
      events,
      teamRequests,
      mutual,
      spotlight,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const allowed = [
    "name", "avatar", "bio", "department", "skills",
    "socials", "currentProject", "graduationYear",
    "college", "company", "lookingFor",
    ];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -otp -otpExpires");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDirectory = async (req, res) => {
  try {
    const { search, department, role } = req.query;

    const filter = { isVerified: true };
    if (department && department !== "All") filter.department = department;
    if (role && role !== "All") filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    // Spotlight users first, then newest
    const users = await User.find(filter)
      .select("name avatar bio university college department graduationYear skills trustScore role spotlightUntil")
      .sort({ spotlightUntil: -1, createdAt: -1 })
      .limit(200);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mutual connections: count conversations containing both users
async function computeMutual(viewerId, profileId) {
  try {
    const viewerConvos = await Conversation.find({ participants: viewerId }).select("participants");
    const viewerPeers = new Set();
    viewerConvos.forEach((c) => {
      c.participants.forEach((p) => {
        if (p.toString() !== viewerId.toString()) viewerPeers.add(p.toString());
      });
    });

    const profileConvos = await Conversation.find({ participants: profileId }).select("participants");
    const mutualIds = [];
    profileConvos.forEach((c) => {
      c.participants.forEach((p) => {
        const pid = p.toString();
        if (pid !== viewerId.toString() && pid !== profileId.toString() && viewerPeers.has(pid)) {
          mutualIds.push(pid);
        }
      });
    });

    const unique = [...new Set(mutualIds)].slice(0, 3);
    if (unique.length === 0) return [];

    const users = await User.find({ _id: { $in: unique } }).select("name university");
    return users.map((u) => ({ _id: u._id, name: u.name, university: u.university }));
  } catch {
    return [];
  }
}