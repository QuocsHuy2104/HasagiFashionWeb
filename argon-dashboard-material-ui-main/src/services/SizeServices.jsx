import apiClient from "config/axiosConfig";

const SizeService = {
    getAllSizes: () => {
        return apiClient.get("/admin/size");
    },

    getSizeById: (sizeId) => apiClient.get(`/admin/size/${sizeId}`),

    createSize: (size) => apiClient.post(`/admin/size`, size),

    updateSize: (id, size) => apiClient.put(`/admin/size/${id}`, size),

    deleteSize: (id) => apiClient.delete(`/admin/size/${id}`)
}

export default SizeService;
