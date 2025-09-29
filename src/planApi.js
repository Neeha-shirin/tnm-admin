import api from "./api";

export const getPlans = () => api.get("/plans/");
export const createPlan = (data) => api.post("/plans/create/", data);
export const updatePlan = (id, data) => api.put(`/plans/${id}/update/`, data);
export const deletePlan = (id) => api.delete(`/plans/${id}/delete/`);
