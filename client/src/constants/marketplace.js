// client/src/constants/marketplace.js

export const CATEGORIES = {
  sell: {
    label: "Sell",
    shortLabel: "Sell",
    emoji: "🛍️",
    desc: "Hand over, get paid.",
    pillClass: "text-indigo-300 border-indigo-500/30 bg-indigo-500/10",
    glow: "rgba(99,102,241,0.4)",
    statColor: "text-indigo-300",
  },
  rent: {
    label: "Rent",
    shortLabel: "Rent",
    emoji: "🔁",
    desc: "Lend it out, get it back.",
    pillClass: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    glow: "rgba(249,115,22,0.4)",
    statColor: "text-orange-300",
  },
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(([value, meta]) => ({
  value,
  ...meta,
}));

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export const RENT_PERIODS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export const STATUS = {
  active:    { label: "Available",  cls: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
  sold:      { label: "Sold",       cls: "text-red-300 border-red-500/30 bg-red-500/10" },
  rented:    { label: "Rented",     cls: "text-orange-300 border-orange-500/30 bg-orange-500/10" },
  completed: { label: "Completed",  cls: "text-blue-300 border-blue-500/30 bg-blue-500/10" },
  hidden:    { label: "Hidden",     cls: "text-gray-300 border-gray-500/30 bg-gray-500/10" },
};

export const OWNER_STATUS_OPTIONS = ["active", "sold", "rented", "hidden"];

export const isPdf = (url) =>
  typeof url === "string" && url.toLowerCase().endsWith(".pdf");

export const formatPrice = (price, category, rentPeriod) => {
  const amount = `Rs. ${Number(price || 0).toLocaleString()}`;
  if (category === "rent" && rentPeriod) return `${amount} / ${rentPeriod}`;
  return amount;
};