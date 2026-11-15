// client/src/services/chatService.js
import api from "./api";

export const startConversation = async ({ recipientId, contextType, contextId }) => {
  const { data } = await api.post("/chat/start", { recipientId, contextType, contextId });
  return data;
};

export const fetchMyConversations = async () => {
  const { data } = await api.get("/chat");
  return data;
};

export const fetchConversationById = async (id) => {
  const { data } = await api.get(`/chat/${id}`);
  return data;
};

export const sendMessageREST = async (id, payload) => {
  const { data } = await api.post(`/chat/${id}/messages`, payload);
  return data;
};

export const archiveConversation = async (id) => {
  const { data } = await api.put(`/chat/${id}/archive`);
  return data;
};