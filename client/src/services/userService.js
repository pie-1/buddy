// client/src/services/userService.js
import api from "./api";

export const fetchMyProfile = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

export const fetchProfileById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await api.put("/users/me", payload);
  return data;
};

export const fetchDirectory = async ({ search, department, role, year } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (department && department !== "All") params.append("department", department);
  if (role && role !== "All") params.append("role", role);
  if (year) params.append("year", year);
  const { data } = await api.get(`/users?${params.toString()}`);
  return data;
};

export const likeUser = async (id) => {
  const { data } = await api.post(`/users/${id}/like`);
  return data;
};

export const unlikeUser = async (id) => {
  const { data } = await api.delete(`/users/${id}/like`);
  return data;
};