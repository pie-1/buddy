// server/controllers/spotlightController.js
import SpotlightClaim from "../models/SpotlightClaim.js";
import User from "../models/User.js";
import {
  currentWeekStart, nextWeekStart, weekEnd, weekLabel,
} from "../utils/weekUtils.js";

const SLOT_COUNT = 3;

// Public: what's the current week's spotlight lineup?
export const getCurrentSpotlight = async (req, res) => {
  try {
    const start = currentWeekStart();
    const end = weekEnd(start);

    const users = await User.find({
      spotlightUntil: { $gte: new Date(), $lte: end },
    })
      .select("name avatar university college department graduationYear bio trustScore spotlightUntil")
      .sort({ spotlightUntil: 1 })
      .limit(SLOT_COUNT);

    res.json({
      weekStart: start,
      weekEnd: end,
      label: weekLabel(start),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: submit a claim for the upcoming week
export const submitClaim = async (req, res) => {
  try {
    const { txnId, screenshot } = req.body;
    if (!txnId || !screenshot) {
      return res.status(400).json({ message: "txnId and screenshot are required" });
    }

    // Must claim for the next week (not current, to prevent gaming mid-week)
    const start = nextWeekStart();
    const end = weekEnd(start);

    // Prevent duplicate pending claims by the same user
    const existing = await SpotlightClaim.findOne({
      userId: req.user._id,
      status: "pending",
      weekStart: start,
    });
    if (existing) {
      return res.status(400).json({
        message: "You already have a pending claim for this week. Please wait for admin review.",
      });
    }

    const claim = await SpotlightClaim.create({
      userId: req.user._id,
      amount: 50,
      txnId,
      screenshot,
      weekStart: start,
      weekEnd: end,
      status: "pending",
    });

    res.status(201).json({
      message: "Claim submitted. An admin will verify it shortly.",
      claim,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: my claim history
export const getMyClaims = async (req, res) => {
  try {
    const claims = await SpotlightClaim.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: pending + all claims
export const getAdminClaims = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const claims = await SpotlightClaim.find(filter)
      .populate("userId", "name email university college")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: verify a claim → assigns the slot
export const verifyClaim = async (req, res) => {
  try {
    const claim = await SpotlightClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    if (claim.status !== "pending") {
      return res.status(400).json({ message: `Claim is already ${claim.status}` });
    }

    // Count how many slots already filled for that week
    const verifiedCount = await SpotlightClaim.countDocuments({
      weekStart: claim.weekStart,
      status: "verified",
    });
    if (verifiedCount >= SLOT_COUNT) {
      return res.status(400).json({
        message: `All ${SLOT_COUNT} slots for this week are already filled.`,
      });
    }

    claim.status = "verified";
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    await claim.save();

    // Update the user's spotlightUntil
    await User.findByIdAndUpdate(claim.userId, {
      spotlightUntil: claim.weekEnd,
    });

    res.json({
      message: "Claim verified. Spotlight slot assigned.",
      claim,
      slotsRemaining: SLOT_COUNT - verifiedCount - 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: reject a claim
export const rejectClaim = async (req, res) => {
  try {
    const { reason } = req.body;
    const claim = await SpotlightClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    if (claim.status !== "pending") {
      return res.status(400).json({ message: `Claim is already ${claim.status}` });
    }

    claim.status = "rejected";
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    claim.rejectionReason = reason || "Payment could not be verified";
    await claim.save();

    res.json({ message: "Claim rejected.", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: promote a user manually (activity fallback)
export const adminPromote = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const start = currentWeekStart();
    const end = weekEnd(start);

    // Ensure slot capacity
    const promotedCount = await User.countDocuments({
      spotlightUntil: { $gte: new Date(), $lte: end },
    });
    if (promotedCount >= SLOT_COUNT) {
      return res.status(400).json({ message: "All slots for this week are filled." });
    }

    await User.findByIdAndUpdate(userId, { spotlightUntil: end });

    res.json({ message: "User promoted to spotlight for this week.", until: end });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};