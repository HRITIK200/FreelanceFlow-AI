import api from "./axios";

export const downloadInvoicePDF =
  async (invoiceId) => {

    const token =
      localStorage.getItem("token");

    const response =
      await api.get(
        `/pdf/${invoiceId}`,
        {
          responseType: "blob",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};