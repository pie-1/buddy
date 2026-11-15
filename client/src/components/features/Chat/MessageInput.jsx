// client/src/components/features/Chat/MessageInput.jsx
import { useRef, useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSend, onTyping, disabled }) {
  const [text, setText] = useState("");
  const typingTimer = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    if (onTyping) {
      onTyping(true);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => onTyping(false), 1200);
    }
  };

  const submit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (onTyping) onTyping(false);
  };

  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-white/10 bg-[#0f0e1a] p-4">
      <textarea
        rows={1}
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit(e);
          }
        }}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 resize-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 max-h-32 transition-all"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="shrink-0 w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white grid place-items-center transition-colors shadow-[0_0_16px_rgba(79,70,229,0.35)]"
      >
        <Send size={16} />
      </button>
    </form>
  );
}