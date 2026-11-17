// client/src/components/features/Roommates/MapLocationInput.jsx
import { useState, useEffect } from "react";
import { MapPin, ExternalLink, AlertTriangle } from "lucide-react";

const INPUT =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm";

const MAP_URL = /^https?:\/\/(www\.)?(google\.(com|co\.[a-z]{2})\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/i;

export default function MapLocationInput({ value, onChange }) {
  const [text, setText] = useState(value?.raw || "");

  useEffect(() => {
    setText(value?.raw || "");
  }, [value?.raw]);

  const handleChange = (e) => {
    const v = e.target.value.trim();
    setText(v);
    onChange(v ? { raw: v } : null);
  };

  const isValid = MAP_URL.test(text);
  const hasText = text.length > 0;

  return (
    <div className="space-y-2">
      <input
        value={text}
        onChange={handleChange}
        placeholder="Paste the Google Maps link to the location"
        className={INPUT}
      />

      <div className="flex items-start gap-2 min-h-[20px]">
        {!hasText && (
          <p className="text-xs text-gray-500 italic">
            Tip: open Google Maps → search the location → tap Share → Copy link → paste here.
          </p>
        )}

        {hasText && isValid && (
          <>
            <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-emerald-400 font-bold">Valid Google Maps link.</span>{" "}
              <span className="text-gray-400">Viewers will be able to open it.</span>
            </div>
          </>
        )}

        {hasText && !isValid && (
          <>
            <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-amber-400 font-bold">Not a Google Maps link.</span>{" "}
              <span className="text-gray-400">
                Copy the URL from Google Maps (share → copy link) and paste it here.
              </span>
            </div>
          </>
        )}

        {hasText && isValid && (
          <a
            href={text}
            target="_blank"
            rel="noreferrer"
            className="ml-auto shrink-0 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Preview <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}