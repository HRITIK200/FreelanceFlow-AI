import api
from "./axios";

const data = await loginUser(formData);

console.log(data);

export const loginUser =
  async (data) => {

    const response =
      await api.post(
        "/auth/login",
        data
      );

    return response.data;
};

export const registerUser =
  async (data) => {

    const response =
      await api.post(
        "/auth/register",
        data
      );

    return response.data;
};