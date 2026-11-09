// client/src/services/listingService.js
import api from "./api";

export const fetchListings = async ({ category, search, sort } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const { data } = await api.get(`/listings?${params.toString()}`);
  return data;
};

export const fetchListingById = async (id) => {
  const { data } = await api.get(`/listings/${id}`);
  return data;
};

export const createListing = async (payload) => {
  const { data } = await api.post("/listings", payload);
  return data;
};

export const updateListing = async (id, payload) => {
  const { data } = await api.put(`/listings/${id}`, payload);
  return data;
};

export const deleteListing = async (id) => {
  const { data } = await api.delete(`/listings/${id}`);
  return data;
};