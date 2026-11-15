// client/src/services/roommateService.js
import api from "./api";

export const fetchRoommates = async ({ kind, area, gender, roomType, minRent, maxRent, sort } = {}) => {
  const params = new URLSearchParams();
  if (kind) params.append("kind", kind);
  if (area) params.append("area", area);
  if (gender && gender !== "any") params.append("gender", gender);
  if (roomType) params.append("roomType", roomType);
  if (minRent) params.append("minRent", minRent);
  if (maxRent) params.append("maxRent", maxRent);
  if (sort) params.append("sort", sort);
  const { data } = await api.get(`/roommates?${params.toString()}`);
  return data;
};

export const fetchRoommateById = async (id) => {
  const { data } = await api.get(`/roommates/${id}`);
  return data;
};

export const createRoommate = async (payload) => {
  const { data } = await api.post("/roommates", payload);
  return data;
};

export const updateRoommate = async (id, payload) => {
  const { data } = await api.put(`/roommates/${id}`, payload);
  return data;
};

export const deleteRoommate = async (id) => {
  const { data } = await api.delete(`/roommates/${id}`);
  return data;
};