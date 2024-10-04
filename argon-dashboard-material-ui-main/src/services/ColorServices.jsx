import apiClient from "config/axiosConfig";

const ColorService = {
    getAllColors: () =>  apiClient.get("/admin/color"),

    getColorById: colorId => apiClient.get(`/admin/color/${colorId}`),

    createColor: color => apiClient.post(`/admin/color`),

    updateColor: id => apiClient.put(`/admin/color/${id}`),

    deleteColor: id => apiClient.delete(`/admin/color/${id}`)
}

export default ColorService
