// server/controllers/teamRequestController.js
import TeamRequest from "../models/TeamRequest.js";
import Event from "../models/Event.js";

export const createTeamRequest = async (req, res) => {
  try {
    const { teamName, pitch, department, rolesNeeded, skillTags, spotsAvailable, contactPreference } = req.body;
    const { eventId } = req.params;

    if (!teamName || !pitch) {
      return res.status(400).json({ message: "teamName and pitch are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const tr = await TeamRequest.create({
      eventId,
      posterId: req.user._id,
      teamName,
      pitch,
      department: department || "Any",
      rolesNeeded: rolesNeeded || [],
      skillTags: skillTags || [],
      spotsAvailable: spotsAvailable || 1,
      contactPreference: contactPreference || "in-app chat",
    });

    res.status(201).json(tr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamRequestsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { skill } = req.query;

    const filter = { eventId, status: "open" };
    if (skill) filter.skillTags = skill;

    const trs = await TeamRequest.find(filter)
      .populate("posterId", "name university trustScore")
      .sort({ createdAt: -1 });

    res.json(trs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamRequestById = async (req, res) => {
  try {
    const tr = await TeamRequest.findById(req.params.id)
      .populate("posterId", "name university trustScore")
      .populate("eventId", "title date venue")
      .populate("applicants.userId", "name university");
    if (!tr) return res.status(404).json({ message: "Team request not found" });
    res.json(tr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeamRequest = async (req, res) => {
  try {
    const tr = await TeamRequest.findById(req.params.id);
    if (!tr) return res.status(404).json({ message: "Team request not found" });

    if (tr.posterId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const editable = ["teamName", "pitch", "department", "rolesNeeded", "skillTags", "spotsAvailable", "contactPreference", "status"];
    editable.forEach((f) => {
      if (req.body[f] !== undefined) tr[f] = req.body[f];
    });

    const updated = await tr.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeamRequest = async (req, res) => {
  try {
    const tr = await TeamRequest.findById(req.params.id);
    if (!tr) return res.status(404).json({ message: "Team request not found" });

    if (tr.posterId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await tr.deleteOne();
    res.json({ message: "Team request removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToTeam = async (req, res) => {
  try {
    const { message } = req.body;
    const tr = await TeamRequest.findById(req.params.id);
    if (!tr) return res.status(404).json({ message: "Team request not found" });

    if (tr.posterId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot apply to your own request" });
    }
    if (tr.status !== "open") {
      return res.status(400).json({ message: "This request is no longer open" });
    }

    const existing = tr.applicants.find((a) => a.userId.toString() === req.user._id.toString());
    if (existing) {
      return res.status(400).json({ message: "You already applied to this team" });
    }

    tr.applicants.push({
      userId: req.user._id,
      status: "pending",
      message: message || "",
    });
    await tr.save();

    res.json({ message: "Application submitted", status: "pending" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const decideApplicant = async (req, res) => {
  try {
    const { userId } = req.params;
    const { decision } = req.body; // "accepted" | "rejected"

    if (!["accepted", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "decision must be accepted or rejected" });
    }

    const tr = await TeamRequest.findById(req.params.id);
    if (!tr) return res.status(404).json({ message: "Team request not found" });

    if (tr.posterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the poster can decide" });
    }

    const applicant = tr.applicants.find((a) => a.userId.toString() === userId);
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });

    applicant.status = decision;

    if (decision === "accepted") {
      const acceptedCount = tr.applicants.filter((a) => a.status === "accepted").length;
      if (acceptedCount >= tr.spotsAvailable) tr.status = "filled";
    }

    await tr.save();
    res.json({ message: `Applicant ${decision}`, status: tr.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};