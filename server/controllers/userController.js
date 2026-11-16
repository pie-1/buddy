// server/controllers/userController.js
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Roommate from "../models/Roommate.js";
import Event from "../models/Event.js";
import TeamRequest from "../models/TeamRequest.js";
import Conversation from "../models/Conversation.js";
import HelpPost from "../models/HelpPost.js";
import { calculateCommonGround, getViewerPeers } from "../utils/commonGround.js"; 
import CollegeRequest from "../models/CollegeRequest.js";

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

    // Get viewer's full profile so we can compare skills/department
    const viewer = await User.findById(viewerId).select("department university skills");
    const viewerPeers = await getViewerPeers(viewerId, Conversation);

    const [listings, roommate, events, teamRequests, helpPosts, mutual] = await Promise.all([
      Listing.find({ sellerId: id, status: "active" }).sort({ createdAt: -1 }).limit(12),
      Roommate.findOne({ postedBy: id, status: { $ne: "hidden" } }).select("-__v"),
      Event.find({ "rsvps.userId": id, "rsvps.status": "going", status: { $in: ["upcoming", "ongoing"] } })
        .select("title date venue coverImage mode tags").sort({ date: 1 }).limit(10),
      TeamRequest.find({ posterId: id, status: "open" })
        .populate("eventId", "title date").sort({ createdAt: -1 }).limit(10),
      HelpPost.find({ authorId: id, status: "open" }).sort({ createdAt: -1 }).limit(10),
      computeMutual(viewerId, id),
    ]);

    await User.findByIdAndUpdate(id, { lastSeenAt: new Date() });

    const spotlight = {
      active: user.spotlightUntil && user.spotlightUntil > new Date(),
      until: user.spotlightUntil,
    };

    // Calculate Common Ground between viewer and this profile
    // We pass the viewed user as the "poster" to check shared traits
    const commonGround = calculateCommonGround(viewer, user, user, viewerPeers);

    res.json({
      user: { ...user.toObject(), isAlumni: user.isAlumni },
      listings,
      roommate,
      events,
      teamRequests,
      helpPosts,
      mutual,
      spotlight,
      // Send the score and reasons to the frontend
      commonGround: {
        score: commonGround.score,
        reasons: commonGround.reason ? [commonGround.reason] : [] 
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowed = [
      "name", "avatar", "bio", "department", "skills",
      "socials", "currentProject", "graduationYear",
      "college", "company", "lookingFor",
    ];

    for (const key of allowed) {
      if (req.body[key] === undefined) continue;

      if (key === "graduationYear") {
        const n = Number(req.body[key]);
        if (!Number.isFinite(n) || n < 2015 || n > 2035) {
          return res.status(400).json({ message: "Graduation year must be between 2015 and 2035." });
        }
        user.graduationYear = n;
        continue;
      }

      if (key === "skills") {
        const raw = Array.isArray(req.body.skills) ? req.body.skills : [];
        user.skills = [...new Set(raw.map((s) => String(s).trim()).filter(Boolean))].slice(0, 20);
        continue;
      }

      if (key === "socials") {
        const incoming = req.body.socials || {};
        user.socials = {
          linkedin: incoming.linkedin ?? user.socials?.linkedin ?? "",
          github: incoming.github ?? user.socials?.github ?? "",
          portfolio: incoming.portfolio ?? user.socials?.portfolio ?? "",
          twitter: incoming.twitter ?? user.socials?.twitter ?? "",
        };
        continue;
      }

      if (typeof req.body[key] === "string") {
        user[key] = req.body[key].trim();
      } else {
        user[key] = req.body[key];
      }
    }

    const saved = await user.save();
    
    // Strip sensitive data
    const safe = saved.toObject();
    delete safe.password;
    delete safe.otp;
    delete safe.otpExpires;

    res.json(safe);
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
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

    const now = new Date();

    const users = await User.find(filter)
      .select("name avatar bio university college department graduationYear skills trustScore role spotlightUntil createdAt")
      .limit(200);

    users.sort((a, b) => {
      const aSpot = a.spotlightUntil && a.spotlightUntil > now ? 1 : 0;
      const bSpot = b.spotlightUntil && b.spotlightUntil > now ? 1 : 0;
      if (aSpot !== bSpot) return bSpot - aSpot;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const spotlighted = users.filter((u) => u.spotlightUntil && u.spotlightUntil > now).slice(0, 3);
    const rest = users.filter((u) => !u.spotlightUntil || u.spotlightUntil <= now);

    res.json({ spotlighted, all: rest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const requestCollegeDomain = async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain || domain.length < 5) {
      return res.status(400).json({ message: "Valid domain required" });
    }
    const exists = await CollegeRequest.findOne({ domain });
    if (exists) return res.status(400).json({ message: "Already requested." });

    await CollegeRequest.create({ domain: domain.replace("@", "").toLowerCase() });
    res.status(201).json({ message: "Request submitted for review." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};