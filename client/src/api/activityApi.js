import api from "./axios";

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