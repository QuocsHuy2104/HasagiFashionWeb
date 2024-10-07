import apiClient from "config/axiosConfig";

const ColorService = {
    getAllColors: () => apiClient.get("/admin/color"),

    getColorById: colorId => apiClient.get(`/admin/color/${colorId}`),

    createColor: color => apiClient.post("/admin/color", color),

    updateColor: (id, color) => apiClient.put(`/admin/color/${id}`, color),

    deleteColor: id => apiClient.delete(`/admin/color/${id}`)
}

export default ColorService;
