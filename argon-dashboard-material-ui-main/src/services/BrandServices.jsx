
import apiClient from "config/axiosConfig";

const BrandsService = {
    getAllBrands: () => apiClient.get("/admin/brand"),

    getBrandById: (brandId) => apiClient.get(`/admin/brand/${brandId}`),

    createBrand: (brand) => apiClient.post("/admin/brand", brand),

    updateBrand: (id, brand) => apiClient.put(`/admin/brand/${id}`, brand),

    deleteBrand: (id) => apiClient.delete(`/admin/brand/${id}`),
    
};

export default BrandsService;


