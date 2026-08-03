import api from "./axios";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats", authHeaders());
  return response.data;
};

export const getReports = async () => {
  const response = await api.get("/dashboard/reports", authHeaders());
  return response.data;
};