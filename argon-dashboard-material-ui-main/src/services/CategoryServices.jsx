import apiClient from "config/axiosConfig";

const CategoriesService = {
    getAllCategories: () => apiClient.get("/admin/category"),

    getCategoryById: (categoryId) => apiClient.get(`/admin/category/${categoryId}`),

    createCategory: (category) => apiClient.post("/admin/category", category),

    updateCategory: (id, category) => apiClient.put(`/admin/category/${id}`, category),

    deleteCategory: (id) => apiClient.delete(`/admin/category/${id}`)

};

export default CategoriesService;


