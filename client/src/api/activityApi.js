import api from "./axios";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getActivities = async ({ page = 1, limit = 20, category } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (category) params.append("category", category);

  const response = await api.get(`/activity?${params}`, authHeaders());
  // Backend now returns { activities, pagination } — support both old and new format
  return response.data?.activities ?? response.data;
};

export const getActivityPage = async ({ page = 1, limit = 20, category } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (category) params.append("category", category);

  const response = await api.get(`/activity?${params}`, authHeaders());
  return response.data; // Full { activities, pagination } object
};