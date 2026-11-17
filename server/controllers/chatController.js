import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

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

    const query = {
      participants: { $all: [req.user._id, recipientId], $size: 2 },
      status: "open",
    };

    if (contextType === "direct") {
      query.contextType = "direct";
    } else {
      query.contextType = contextType;
      query.contextId = contextId;
    }

    const existing = await Conversation.findOne(query);
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
    if (!req.user?._id) return res.status(401).json({ message: "Not authorized" });

    const conversations = await Conversation.find({
      participants: req.user._id,
      status: "open",
    })
      .populate("participants", "name university trustScore avatar")
      .sort({ updatedAt: -1 })
      .limit(100);

    const uniqueMap = new Map();
    
    conversations.forEach(c => {
      const other = c.participants.find(p => p._id.toString() !== req.user._id.toString());
      if (!other) return;
      const otherId = other._id.toString();
      
      if (!uniqueMap.has(otherId) || uniqueMap.get(otherId).updatedAt < c.updatedAt) {
        uniqueMap.set(otherId, c);
      }
    });

    const deduplicated = Array.from(uniqueMap.values()).sort((a,b) => b.updatedAt - a.updatedAt);
    res.json(deduplicated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("participants", "name university trustScore avatar");
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    const limit = Number(req.query.limit) || 50;
    const messages = await Message.find({ conversationId: conversation._id })
      .populate("senderId", "name avatar")
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
      return res.status(403).json({ message: "Not a participant" });
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

    const populated = await message.populate("senderId", "name avatar");
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
      return res.status(403).json({ message: "Not a participant" });
    }

    conversation.status = "archived";
    await conversation.save();
    res.json({ message: "Conversation archived" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};