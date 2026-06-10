import api from "./axios";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProjects = async () => {
  const response = await api.get(
    "/projects",
    getAuthHeaders()
  );

  return response.data;
};

export const createProject = async (data) => {
  const response = await api.post(
    "/projects",
    data,
    getAuthHeaders()
  );

  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(
    `/projects/${id}`,
    data,
    getAuthHeaders()
  );

  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(
    `/projects/${id}`,
    getAuthHeaders()
  );

  return response.data;
};