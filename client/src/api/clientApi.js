import api from "./axios";

const getAuthHeaders = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getClients =
  async () => {
    const response =
      await api.get(
        "/clients",
        getAuthHeaders()
      );

    return response.data;
};

export const createClient =
  async (data) => {
    const response =
      await api.post(
        "/clients",
        data,
        getAuthHeaders()
      );

    return response.data;
};

export const updateClient =
  async (id, data) => {

    const response =
      await api.put(
        `/clients/${id}`,
        data,
        getAuthHeaders()
      );

    return response.data;
};

export const deleteClient =
  async (id) => {

    const response =
      await api.delete(
        `/clients/${id}`,
        getAuthHeaders()
      );

    return response.data;
};