// client/src/services/eventService.js
import api from "./api";

export const fetchEvents = async ({ tag, mode, search, sort } = {}) => {
  const params = new URLSearchParams();
  if (tag) params.append("tag", tag);
  if (mode) params.append("mode", mode);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);
  const { data } = await api.get(`/events?${params.toString()}`);
  return data;
};

export const fetchEventById = async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data;
};

export const createEvent = async (payload) => {
  const { data } = await api.post("/events", payload);
  return data;
};

export const updateEvent = async (id, payload) => {
  const { data } = await api.put(`/events/${id}`, payload);
  return data;
};

export const deleteEvent = async (id) => {
  const { data } = await api.delete(`/events/${id}`);
  return data;
};

export const rsvpEvent = async (id, status) => {
  const { data } = await api.post(`/events/${id}/rsvp`, { status });
  return data;
};