// server/utils/trustScore.js
import User from "../models/User.js";

export const TRUST_POINTS = {
  EMAIL_VERIFIED: 5,
  FIRST_PROFILE_COMPLETE: 10,
  LISTING_SOLD: 5,
  EVENT_ATTENDED: 3,
  HELP_ANSWER_ACCEPTED: 8,
  SPOTLIGHT_VERIFIED: 10,
  ADMIN_VERIFICATION: 2,
  ADMIN_CLAIM_REVIEW: 1,
};

export async function awardTrust(userId, action, amountOverride) {
  const amount = amountOverride ?? TRUST_POINTS[action] ?? 0;
  if (!amount) return null;
  return User.findByIdAndUpdate(userId, { $inc: { trustScore: amount } }, { new: true }).select("trustScore");
}

export function trustLevel(score) {
  if (score >= 100) return { label: "Elite", color: "text-purple-700" };
  if (score >= 50) return { label: "Respected", color: "text-emerald-700" };
  if (score >= 20) return { label: "Trusted", color: "text-orange-700" };
  return { label: "Newcomer", color: "text-stone-500" };
}