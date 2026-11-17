import api from "./api";

export const fetchCurrentSpotlight = async () => {
  const { data } = await api.get("/spotlight/current");
  return data;
};

export const submitSpotlightClaim = async ({ txnId, screenshot, targetType, targetId }) => {
  const { data } = await api.post("/spotlight/claim", { 
    txnId, 
    screenshot, 
    targetType, 
    targetId 
  });
  return data;
};

export const fetchMyClaims = async () => {
  const { data } = await api.get("/spotlight/my-claims");
  return data;
};

export const fetchAdminClaims = async ({ status } = {}) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  const { data } = await api.get(`/spotlight/admin/claims?${params.toString()}`);
  return data;
};

export const verifyClaim = async (id) => {
  const { data } = await api.post(`/spotlight/admin/claims/${id}/verify`);
  return data;
};

export const rejectClaim = async (id, reason) => {
  const { data } = await api.post(`/spotlight/admin/claims/${id}/reject`, { reason });
  return data;
};

export const adminPromote = async (userId) => {
  const { data } = await api.post("/spotlight/admin/promote", { userId });
  return data;
};