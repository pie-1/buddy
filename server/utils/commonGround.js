// server/utils/commonGround.js

/**
 * Calculates a recommendation score (0 to 1) based on shared traits.
 * Returns an object with the score and a human-readable "reason" string.
 */
export const calculateCommonGround = (viewer, item, poster, viewerConvoPeers = []) => {
  if (!viewer) return { score: 0, reason: "" };

  let score = 0;
  const reasons = [];

  // 1. Shared Department (35%)
  if (viewer.department && poster?.department && viewer.department === poster.department) {
    score += 0.35;
    reasons.push("Same department");
  }

  // 2. Shared University (25%)
  if (viewer.university && poster?.university && viewer.university === poster.university) {
    score += 0.25;
    if (!reasons.includes("Same department")) {
      reasons.push("Same university");
    }
  }

  // 3. Mutual Connection (15%) - Do they chat with the same people?
  // viewerConvoPeers is an array of IDs the viewer has chatted with.
  // If the poster is in that list, they already know each other.
  const posterId = poster?._id?.toString() || item.sellerId?.toString() || item.postedBy?.toString() || item.organizerId?.toString();
  if (posterId && viewerConvoPeers.includes(posterId)) {
    score += 0.15;
    reasons.push("You already know them");
  }

  // 4. Skill/Interest Overlap (10%)
  // Check if the item's tags or title overlap with the viewer's skills
  const itemTags = (item.tags || item.skills || []).map(t => t.toLowerCase());
  const viewerSkills = (viewer.skills || []).map(s => s.toLowerCase());
  
  const sharedSkills = viewerSkills.filter(s => itemTags.includes(s) || (item.title && item.title.toLowerCase().includes(s)));
  
  if (sharedSkills.length > 0) {
    score += 0.10;
    // e.g., "Shares 2 skills"
    reasons.push(`Matches your skills (${sharedSkills.slice(0, 2).join(", ")})`);
  }

  // 5. Recency (8%) - Posted in the last 48 hours
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  if (item.createdAt && new Date(item.createdAt) > twoDaysAgo) {
    score += 0.08;
  }

  // 6. Trust Score (5%)
  if (poster?.trustScore > 0) {
    // Normalize trust score (assuming max 100) up to 0.05
    score += Math.min((poster.trustScore / 100) * 0.05, 0.05);
  }

  // Cap at 1.0
  score = Math.min(score, 1);

  return {
    score,
    // Return the primary reason, or fall back to a generic one if they just have a high trust score
    reason: reasons[0] || (score > 0.1 ? "Recommended for you" : "")
  };
};

/**
 * Helper to get the IDs of everyone the viewer has a conversation with.
 */
export const getViewerPeers = async (viewerId, ConversationModel) => {
  try {
    const convos = await ConversationModel.find({ participants: viewerId }).select("participants");
    const peers = new Set();
    convos.forEach(c => {
      c.participants.forEach(p => {
        if (p.toString() !== viewerId.toString()) peers.add(p.toString());
      });
    });
    return Array.from(peers);
  } catch {
    return [];
  }
};