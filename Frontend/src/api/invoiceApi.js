import api from "./axios";

export const getInvoices = (params) =>
  api.get("/api/invoices", { params });

export const createInvoice = (data) =>
  api.post("/api/invoices", data);

export const updateInvoice = (id, data) =>
  api.put(`/api/invoices/${id}`, data);

export const deleteInvoice = (id) =>
  api.delete(`/api/invoices/${id}`);