export const calculateCommonGround = (viewer, item, poster, viewerConvoPeers = []) => {
  if (!viewer) return { score: 0, reason: "" };

  let score = 0;
  const reasons = [];

  if (viewer.department && poster?.department && viewer.department === poster.department) {
    score += 0.35;
    reasons.push("Same department");
  }

  if (viewer.university && poster?.university && viewer.university === poster.university) {
    score += 0.25;
    if (!reasons.includes("Same department")) {
      reasons.push("Same university");
    }
  }

  const posterId = poster?._id?.toString() || item.sellerId?.toString() || item.postedBy?.toString() || item.organizerId?.toString();
  if (posterId && viewerConvoPeers.includes(posterId)) {
    score += 0.15;
    reasons.push("You already know them");
  }

  const itemTags = (item.tags || item.skills || []).map(t => t.toLowerCase());
  const viewerSkills = (viewer.skills || []).map(s => s.toLowerCase());
  
  const sharedSkills = viewerSkills.filter(s => itemTags.includes(s) || (item.title && item.title.toLowerCase().includes(s)));
  
  if (sharedSkills.length > 0) {
    score += 0.10;
    reasons.push(`Matches your skills (${sharedSkills.slice(0, 2).join(", ")})`);
  }

  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  if (item.createdAt && new Date(item.createdAt) > twoDaysAgo) {
    score += 0.08;
  }

  if (poster?.trustScore > 0) {   
    score += Math.min((poster.trustScore / 100) * 0.05, 0.05);
  }

  score = Math.min(score, 1);

  return {
    score,
    reason: reasons[0] || (score > 0.1 ? "Recommended for you" : "")
  };
};

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