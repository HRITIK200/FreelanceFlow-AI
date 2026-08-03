import api from "./axios";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me", authHeaders());
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data, authHeaders());
  return response.data;
};