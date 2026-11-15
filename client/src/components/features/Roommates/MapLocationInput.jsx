// client/src/components/features/Roommates/MapLocationInput.jsx
import { useState, useEffect } from "react";
import { MapPin, ExternalLink, AlertTriangle } from "lucide-react";
import { parseMapLocation } from "../../../utils/parseMapLocation";

const INPUT =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm";

export default function MapLocationInput({ value, onChange }) {
  const [text, setText] = useState(value?.raw || "");

  useEffect(() => {
    setText(value?.raw || "");
  }, [value?.raw]);

  const handleChange = (e) => {
    const v = e.target.value;
    setText(v);
    const parsed = parseMapLocation(v);
    onChange(parsed);
  };

  const isValidCoord = Number.isFinite(value?.lat) && Number.isFinite(value?.lng);
  const hasText = text.trim().length > 0;

  return (
    <div className="space-y-2">
      <input
        value={text}
        onChange={handleChange}
        placeholder="Paste a Google Maps link, or coordinates like 27.7172, 85.3240"
        className={INPUT}
      />

      <div className="flex items-start gap-2 min-h-[20px]">
        {!hasText && (
          <p className="text-xs text-gray-500 italic">
            Tip: open Google Maps → right-click the spot → click the coordinates to copy them.
          </p>
        )}

        {hasText && isValidCoord && (
          <>
            <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-emerald-400 font-bold">Location parsed:</span>{" "}
              <span className="text-gray-300 font-mono">
                {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
              </span>
            </div>
          </>
        )}

        {hasText && !isValidCoord && (
          <>
            <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-amber-400 font-bold">Could not parse coordinates.</span>{" "}
              <span className="text-gray-400">
                We'll still save the link so viewers can open it.
              </span>
            </div>
          </>
        )}

        {hasText && (
          <a
            href={text.startsWith("http") ? text : `https://www.google.com/maps?q=${text}`}
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