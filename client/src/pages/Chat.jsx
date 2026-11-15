// client/src/pages/Chat.jsx
import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import {
  fetchMyConversations,
  fetchConversationById,
} from "../services/chatService";
import MessageList from "../components/features/Chat/MessageList";
import MessageInput from "../components/features/Chat/MessageInput";
import ThreadHeader from "../components/features/Chat/ThreadHeader";

export default function Chat() {
  const { id: activeId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [typingFrom, setTypingFrom] = useState(null);
  const [marking, setMarking] = useState(false);

  // Fetch inbox on load
  useEffect(() => {
    fetchMyConversations()
      .then(setConversations)
      .finally(() => setLoadingList(false));
  }, []);

  // Fetch active thread
  useEffect(() => {
    if (!activeId) {
      setActiveConvo(null);
      setMessages([]);
      return;
    }
    setLoadingThread(true);
    fetchConversationById(activeId)
      .then(({ conversation, messages }) => {
        setActiveConvo(conversation);
        setMessages(messages);
      })
      .finally(() => setLoadingThread(false));
  }, [activeId]);

  // Join the conversation room via socket
  useEffect(() => {
    if (!socket || !activeId) return;
    socket.emit("join-conversation", { conversationId: activeId });
    return () => socket.emit("leave-conversation", { conversationId: activeId });
  }, [socket, activeId]);

  // Listen for events
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (msg.conversationId === activeId) {
        setMessages((prev) => {
          // dedupe by _id (optimistic + server-confirmed)
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    const onTyping = ({ userId, isTyping }) => {
      if (userId === user?._id) return;
      setTypingFrom(isTyping ? userId : null);
    };

    socket.on("new-message", onNewMessage);
    socket.on("user-typing", onTyping);
    return () => {
      socket.off("new-message", onNewMessage);
      socket.off("user-typing", onTyping);
    };
  }, [socket, activeId, user?._id]);

  const sendMessage = (text) => {
    if (!socket || !activeId) return;
    socket.emit("send-message", { conversationId: activeId, text }, () => {});
  };

  const onTyping = (isTyping) => {
    if (!socket || !activeId) return;
    socket.emit("typing", { conversationId: activeId, isTyping });
  };

  const markDone = () => {
    if (!socket || !activeId) return;
    setMarking(true);
    socket.emit(
      "send-message",
      { conversationId: activeId, systemEvent: "marked-done" },
      () => setMarking(false)
    );
  };

  const getOtherUser = (convo) =>
    convo?.participants?.find((p) => p._id !== user?._id);

  return (
    <div data-nav-theme="dark" className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-4 pb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} /> Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] bg-[#14121f] border border-white/10 rounded-2xl overflow-hidden h-[calc(100vh-180px)]">
          {/* Inbox */}
          <aside className="border-r border-white/10 overflow-y-auto">
            <div className="p-4 border-b border-white/10">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-500">Inbox</p>
            </div>
            {loadingList ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={20} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No conversations yet.</div>
            ) : (
              conversations.map((c) => {
                const other = getOtherUser(c);
                const active = c._id === activeId;
                return (
                  <Link
                    key={c._id}
                    to={`/chat/${c._id}`}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 transition-colors ${
                      active ? "bg-indigo-500/10 border-l-2 border-l-indigo-500" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white text-xs font-bold shrink-0">
                      {other?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white truncate">{other?.name || "Unknown"}</div>
                      <div className="text-xs text-gray-500 truncate">{c.lastMessage?.text || "No messages yet"}</div>
                    </div>
                  </Link>
                );
              })
            )}
          </aside>

          {/* Thread */}
          <main className="flex flex-col min-w-0">
            {loadingThread ? (
              <div className="flex-1 grid place-items-center">
                <Loader2 className="animate-spin text-indigo-500" size={28} />
              </div>
            ) : !activeConvo ? (
              <div className="flex-1 grid place-items-center text-center p-8">
                <div>
                  <MessageCircle size={48} className="text-white/10 mx-auto mb-4" />
                  <p className="text-gray-500">Select a conversation to start messaging.</p>
                </div>
              </div>
            ) : (
              <>
                <ThreadHeader
                  conversation={activeConvo}
                  otherUser={getOtherUser(activeConvo)}
                  onMarkDone={markDone}
                  marking={marking}
                />
                <MessageList messages={messages} currentUserId={user?._id} />
                <AnimatePresence>
                  {typingFrom && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="px-5 py-2 text-xs text-gray-500 italic border-t border-white/5"
                    >
                      {getOtherUser(activeConvo)?.name} is typing
                      <span className="inline-flex gap-0.5 ml-1">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }}>.</motion.span>
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>.</motion.span>
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>.</motion.span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <MessageInput onSend={sendMessage} onTyping={onTyping} disabled={!socket} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}