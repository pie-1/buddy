// client/src/utils/parseMapLocation.js

// Supported inputs:
//   "27.7172, 85.3240"
//   "27.7172,85.3240"
//   "https://www.google.com/maps/@27.7172,85.3240,15z"
//   "https://www.google.com/maps/place/Somewhere/@27.7172,85.3240,15z/data=..."
//   "https://maps.app.goo.gl/abc123"  ← short links won't have coords visible
export function parseMapLocation(input) {
  if (!input) return { lat: null, lng: null, raw: "" };
  const str = String(input).trim();

  // 1. Raw coordinates: "27.7172, 85.3240"
  const raw = str.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (raw) {
    const lat = parseFloat(raw[1]);
    const lng = parseFloat(raw[2]);
    if (isValid(lat, lng)) return { lat, lng, raw: str };
    return { lat: null, lng: null, raw: str };
  }

  // 2. Google Maps URL with @lat,lng
  const atMatch = str.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValid(lat, lng)) return { lat, lng, raw: str };
  }

  // 3. URL query ?q=lat,lng or ?query=lat,lng or ?ll=lat,lng
  const queryMatch = str.match(/[?&](?:q|query|ll|center)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (isValid(lat, lng)) return { lat, lng, raw: str };
  }

  // 4. Fallback: URL has "place/lat,lng" — Google sometimes uses this
  const placeMatch = str.match(/place\/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (placeMatch) {
    const lat = parseFloat(placeMatch[1]);
    const lng = parseFloat(placeMatch[2]);
    if (isValid(lat, lng)) return { lat, lng, raw: str };
  }

  // 5. Nothing parseable — save raw only (viewer sees "Open in Google Maps")
  return { lat: null, lng: null, raw: str };
}

function isValid(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
}