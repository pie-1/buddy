// server/controllers/adminController.js
import CollegeRequest from "../models/CollegeRequest.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Event from "../models/Event.js";

// --- DOMAIN REQUESTS ---
export const getCollegeRequests = async (req, res) => {
  try {
    const requests = await CollegeRequest.find().populate("requestedBy", "name email").sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollegeRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await CollegeRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- PLATFORM STATS & MANAGEMENT ---
export const getAdminStats = async (req, res) => {
  try {
    const [users, listings, events, requests] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments({ status: "active" }),
      Event.countDocuments({ status: "upcoming" }),
      CollegeRequest.countDocuments({ status: "pending" })
    ]);
    res.json({ users, listings, events, pendingRequests: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role university trustScore isVerified createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};