// client/src/services/teamRequestService.js
import api from "./api";

export const fetchTeamRequestsForEvent = async (eventId, { skill } = {}) => {
  const params = new URLSearchParams();
  if (skill) params.append("skill", skill);
  const { data } = await api.get(`/events/${eventId}/team-requests?${params}`);
  return data;
};

export const fetchTeamRequestById = async (id) => {
  const { data } = await api.get(`/team-requests/${id}`);
  return data;
};

export const createTeamRequest = async (eventId, payload) => {
  const { data } = await api.post(`/events/${eventId}/team-requests`, payload);
  return data;
};

export const updateTeamRequest = async (id, payload) => {
  const { data } = await api.put(`/team-requests/${id}`, payload);
  return data;
};

export const deleteTeamRequest = async (id) => {
  const { data } = await api.delete(`/team-requests/${id}`);
  return data;
};

export const applyToTeam = async (id, message) => {
  const { data } = await api.post(`/team-requests/${id}/apply`, { message });
  return data;
};

export const decideApplicant = async (id, userId, decision) => {
  const { data } = await api.put(`/team-requests/${id}/applicants/${userId}`, { decision });
  return data;
};