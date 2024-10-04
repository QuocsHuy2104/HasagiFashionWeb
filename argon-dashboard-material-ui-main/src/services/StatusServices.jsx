import apiClient from "config/axiosConfig";

const StatusServices = {
  getAllStatuses: () => {
    return apiClient.get("/admin/status");
  },
  getStatusById: (statusId) => apiClient.get(`/admin/status/${statusId}`),

  createStatus: (status) => apiClient.post("/admin/status", status),

  updateStatus: (id, status) => apiClient.put(`/admin/status/${id}`, status),

  deleteStatus: (id) => apiClient.delete(`/admin/status/${id}`)
};

export default StatusServices;
