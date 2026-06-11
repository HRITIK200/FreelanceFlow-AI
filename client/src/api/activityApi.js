import api from "./axios";

const getAuthHeaders = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
  },
 });

export const getActivities =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await api.get(
        "/activity",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};