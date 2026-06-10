import api from "./axios";

export const sendInvoiceEmail =
  async (invoiceId) => {

    const token =
      localStorage.getItem("token");

    const response =
      await api.post(
        `/email/invoice/${invoiceId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};