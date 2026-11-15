// server/controllers/chatController.js
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Robust participant check: handles populated docs, ObjectIds, and strings
function isParticipant(conversation, userId) {
  if (!userId) return false;
  const target = userId.toString();
  return conversation.participants.some((p) => {
    const id = p?._id?.toString() || p?.toString();
    return id === target;
  });
}

export const startConversation = async (req, res) => {
  try {
    const { recipientId, contextType, contextId } = req.body;

    if (!recipientId || !contextType || !contextId) {
      return res.status(400).json({ message: "recipientId, contextType, and contextId are required" });
    }
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot start a conversation with yourself" });
    }

    const existing = await Conversation.findOne({
      contextType,
      contextId,
      participants: { $all: [req.user._id, recipientId], $size: 2 },
    });

    if (existing) return res.json(existing);

    const conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
      contextType,
      contextId,
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    // Guard: if req.user is missing, return 401, not all conversations
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const conversations = await Conversation.find({
      participants: req.user._id,
      status: "open",
    })
      .populate("participants", "name university trustScore")
      .sort({ updatedAt: -1 })
      .limit(100);

    // Defense in depth: filter again in JS
    const mine = conversations.filter((c) => isParticipant(c, req.user._id));

    res.json(mine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("participants", "name university trustScore");
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    const limit = Number(req.query.limit) || 50;
    const messages = await Message.find({ conversationId: conversation._id })
      .populate("senderId", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ conversation, messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, systemEvent } = req.body;

    if (!text && !image && !systemEvent) {
      return res.status(400).json({ message: "Message must include text, image, or systemEvent" });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.user._id,
      text: text || "",
      image: image || null,
      systemEvent: systemEvent || null,
    });

    conversation.lastMessage = {
      text: systemEvent ? `[${systemEvent}]` : text || (image ? "[image]" : ""),
      senderId: req.user._id,
      at: new Date(),
    };
    await conversation.save();

    const populated = await message.populate("senderId", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const archiveConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    conversation.status = "archived";
    await conversation.save();
    res.json({ message: "Conversation archived" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};