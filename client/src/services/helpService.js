// client/src/services/helpService.js
import api from "./api";

export const fetchHelpPosts = async ({ status, tag } = {}) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (tag) params.append("tag", tag);
  const { data } = await api.get(`/help?${params.toString()}`);
  return data;
};

export const fetchHelpPostById = async (id) => {
  const { data } = await api.get(`/help/${id}`);
  return data;
};

export const createHelpPost = async (payload) => {
  const { data } = await api.post("/help", payload);
  return data;
};

export const replyToHelpPost = async (id, text) => {
  const { data } = await api.post(`/help/${id}/reply`, { text });
  return data;
};

export const toggleHelpPostStatus = async (id) => {
  const { data } = await api.put(`/help/${id}/toggle-status`);
  return data;
};

export const deleteHelpPost = async (id) => {
  const { data } = await api.delete(`/help/${id}`);
  return data;
};