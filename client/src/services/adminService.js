// client/src/services/adminService.js
import api from "./api";

export const fetchCollegeRequests = async () => {
  const { data } = await api.get("/admin/college-requests");
  return data;
};

export const updateCollegeRequest = async (id, status) => {
  const { data } = await api.put(`/admin/college-requests/${id}`, { status });
  return data;
};

export const fetchAdminStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const fetchAllUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};