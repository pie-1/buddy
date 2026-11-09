// server/controllers/eventController.js
import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, endDate, venue, location, department, college, capacity, coverImage } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({ message: "title, description, date, and venue are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      endDate: endDate || null,
      venue,
      location: location || {},
      department: department || "All",
      college: college || "All",
      capacity: capacity || null,
      coverImage: coverImage || null,
      organizerId: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { department, college, status, search, sort } = req.query;
    const filter = {};

    if (status) filter.status = status;
    else filter.status = { $in: ["upcoming", "ongoing"] };

    if (department && department !== "All") {
      filter.department = { $in: ["All", department] };
    }
    if (college && college !== "All") {
      filter.college = { $in: ["All", college] };
    }
    if (search) filter.$text = { $search: search };

    const sortBy = sort === "date-desc" ? { date: -1 } : { date: 1 };

    const events = await Event.find(filter)
      .populate("organizerId", "name university")
      .sort(sortBy)
      .limit(100);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizerId", "name university")
      .populate("rsvps.userId", "name university");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const editable = ["title", "description", "date", "endDate", "venue", "location", "department", "college", "capacity", "coverImage", "status"];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rsvpEvent = async (req, res) => {
  try {
    const { status } = req.body; // "going" | "interested"
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = event.rsvps.find((r) => r.userId.toString() === req.user._id.toString());

    if (existing) {
      // Un-RSVP if same status clicked again
      if (existing.status === status) {
        event.rsvps = event.rsvps.filter((r) => r.userId.toString() !== req.user._id.toString());
        await event.save();
        return res.json({ message: "RSVP removed", rsvp: null, count: event.rsvps.length });
      }
      // Otherwise, switch status
      existing.status = status;
      existing.rsvpAt = new Date();
    } else {
      // Check capacity
      if (event.capacity && status === "going" && event.rsvps.filter((r) => r.status === "going").length >= event.capacity) {
        return res.status(400).json({ message: "Event is at full capacity" });
      }
      event.rsvps.push({ userId: req.user._id, status });
    }

    await event.save();
    res.json({ message: "RSVP updated", rsvp: status, count: event.rsvps.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};