// server/sockets/chatSocket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const online = new Map();

function isParticipant(conversation, userId) {
  const target = userId.toString();
  return conversation.participants.some((p) => {
    const id = p?._id?.toString() || p?.toString();
    return id === target;
  });
}

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const uid = socket.userId;

    if (!online.has(uid)) online.set(uid, new Set());
    online.get(uid).add(socket.id);
    socket.join(`user:${uid}`);
    io.emit("presence", { userId: uid, online: true });

    socket.on("join-conversation", async ({ conversationId }) => {
      const convo = await Conversation.findById(conversationId);
      if (!convo || !isParticipant(convo, uid)) return;
      socket.join(`convo:${conversationId}`);
    });

    socket.on("leave-conversation", ({ conversationId }) => {
      socket.leave(`convo:${conversationId}`);
    });

    socket.on("send-message", async ({ conversationId, text, systemEvent }, ack) => {
      try {
        if (!text && !systemEvent) return ack?.({ error: "Empty message" });

        const convo = await Conversation.findById(conversationId);
        if (!convo) return ack?.({ error: "Not found" });
        if (!isParticipant(convo, uid)) return ack?.({ error: "Forbidden" });

        const msg = await Message.create({
          conversationId,
          senderId: uid,
          text: text || "",
          systemEvent: systemEvent || null,
        });

        convo.lastMessage = {
          text: systemEvent ? `[${systemEvent}]` : text || "",
          senderId: uid,
          at: new Date(),
        };
        await convo.save();

        // Populate sender avatar as well
        const populated = await msg.populate("senderId", "name avatar");

        io.to(`convo:${conversationId}`).emit("new-message", populated);

        convo.participants
          .filter((p) => (p?._id?.toString() || p?.toString()) !== uid.toString())
          .forEach((p) => {
            const otherId = p?._id?.toString() || p?.toString();
            io.to(`user:${otherId}`).emit("conversation-updated", { conversationId });
          });

        ack?.({ ok: true, message: populated });
      } catch (err) {
        ack?.({ error: err.message });
      }
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`convo:${conversationId}`).emit("user-typing", { userId: uid, isTyping });
    });

    socket.on("disconnect", () => {
      const set = online.get(uid);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) {
          online.delete(uid);
          io.emit("presence", { userId: uid, online: false });
        }
      }
    });
  });

  return io;
}