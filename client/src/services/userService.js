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
  try {
    const { data } = await api.put("/users/me", payload);
    return data;
  } catch (error) {
    // Log the exact backend response to the console so we can see it!
    console.error("Backend save error:", error.response?.data || error.message);
    throw error;
  }
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