// client/src/components/features/Chat/MessageList.jsx
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

function Bubble({ msg, isMine }) {
  const isSystem = !!msg.systemEvent;

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-full">
          {msg.systemEvent.replace(/-/g, " ")}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-2 ${isMine ? "justify-end" : "justify-start"}`}
    >
      {!isMine && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white text-[10px] font-bold shrink-0 mt-auto">
          {msg.senderId?.name?.[0]?.toUpperCase() || "?"}
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isMine
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-white/[0.06] text-gray-100 border border-white/10 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMine ? "text-indigo-200/70" : "text-gray-500"}`}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {isMine && (msg.seen ? <CheckCheck size={11} /> : <Check size={11} />)}
        </div>
      </div>
    </motion.div>
  );
}

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-3">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-center text-gray-500 text-sm">
          No messages yet. Say hi 👋
        </div>
      )}
      {messages.map((m) => (
        <Bubble key={m._id} msg={m} isMine={m.senderId?._id === currentUserId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}