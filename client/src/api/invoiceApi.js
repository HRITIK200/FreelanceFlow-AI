import api from "./axios";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createInvoice = async (data) => {
  const response = await api.post(
    "/invoices",
    data,
    getAuthHeaders()
  );

  return response.data;
};

export const getInvoices = async () => {
  const response = await api.get(
    "/invoices",
    getAuthHeaders()
  );

  return response.data;
};


export const updateInvoice = async (
  id,
  data
) => {

  const response = await api.put(
    `/invoices/${id}`,
    data,
    getAuthHeaders()
  );

  return response.data;
};

export const deleteInvoice = async (
  id
) => {

  const response = await api.delete(
    `/invoices/${id}`,
    getAuthHeaders()
  );

  return response.data;
};