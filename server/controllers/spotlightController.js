import SpotlightClaim from "../models/SpotlightClaim.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
import { awardTrust, TRUST_POINTS } from "../utils/trustScore.js";
import { currentWeekStart, nextWeekStart, weekEnd, weekLabel } from "../utils/weekUtils.js";

const SLOT_COUNT = 3;

export const getCurrentSpotlight = async (req, res) => {
  try {
    const now = new Date();
    const users = await User.find({ spotlightUntil: { $gte: now } })
      .select("name avatar university college department graduationYear bio trustScore spotlightUntil")
      .sort({ spotlightUntil: 1 })
      .limit(SLOT_COUNT);

    const events = await Event.find({ spotlightUntil: { $gte: now } })
      .select("title coverImage date venue description spotlightUntil")
      .populate("organizerId", "name university")
      .sort({ spotlightUntil: 1 })
      .limit(SLOT_COUNT);

    res.json({ 
      weekStart: currentWeekStart(), 
      weekEnd: weekEnd(currentWeekStart()), 
      label: weekLabel(currentWeekStart()), 
      users, 
      events 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitClaim = async (req, res) => {
  try {
    const { txnId, screenshot, targetType, targetId } = req.body;

    if (!txnId || !screenshot) {
      return res.status(400).json({ message: "txnId and screenshot are required" });
    }

    let finalTargetType = targetType || "user";
    let finalTargetId = targetId;

    if (finalTargetType === "user") {
      finalTargetId = req.user._id;
    } else if (finalTargetType === "event") {
      if (!finalTargetId) return res.status(400).json({ message: "targetId (event ID) is required" });
      const event = await Event.findById(finalTargetId);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "You can only spotlight your own events" });
      }
    } else {
      return res.status(400).json({ message: "Invalid targetType" });
    }

    const start = nextWeekStart();
    const end = weekEnd(start);

    const existing = await SpotlightClaim.findOne({
      userId: req.user._id, targetId: finalTargetId, status: "pending", weekStart: start,
    });
    if (existing) return res.status(400).json({ message: "You already have a pending claim for this item this week." });

    const claim = await SpotlightClaim.create({
      userId: req.user._id, targetType: finalTargetType, targetId: finalTargetId,
      amount: 50, txnId, screenshot, weekStart: start, weekEnd: end, status: "pending",
    });

    res.status(201).json({ message: "Claim submitted.", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const claims = await SpotlightClaim.find({ userId: req.user._id })
      .populate("targetId", "name title")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminClaims = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const claims = await SpotlightClaim.find(filter)
      .populate("userId", "name email university college")
      .populate("targetId", "name title")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyClaim = async (req, res) => {
  try {
    const claim = await SpotlightClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    if (claim.status !== "pending") return res.status(400).json({ message: `Claim is already ${claim.status}` });

    claim.status = "verified";
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    await claim.save();

    if (claim.targetType === "event") {
      await Event.findByIdAndUpdate(claim.targetId, { spotlightUntil: claim.weekEnd });
    } else {
      await User.findByIdAndUpdate(claim.targetId, { spotlightUntil: claim.weekEnd });
    }

    await awardTrust(claim.userId, "SPOTLIGHT_VERIFIED");
    await awardTrust(req.user._id, "ADMIN_CLAIM_REVIEW");

    res.json({ message: "Claim verified. Spotlight slot assigned.", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectClaim = async (req, res) => {
  try {
    const { reason } = req.body;
    const claim = await SpotlightClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    if (claim.status !== "pending") return res.status(400).json({ message: `Claim is already ${claim.status}` });

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

export const adminPromote = async (req, res) => {
  try {
    const { targetId, targetType = "user" } = req.body;
    if (!targetId) return res.status(400).json({ message: "targetId is required" });
    const end = weekEnd(currentWeekStart());
    if (targetType === "event") {
      await Event.findByIdAndUpdate(targetId, { spotlightUntil: end });
    } else {
      await User.findByIdAndUpdate(targetId, { spotlightUntil: end });
    }
    res.json({ message: `${targetType} promoted to spotlight.`, until: end });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};