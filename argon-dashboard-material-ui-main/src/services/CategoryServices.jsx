import apiClient from "config/axiosConfig";

const CategoriesService = {
    //admin
    getAllCategories: () => apiClient.get("/admin/category"),

    getCategoryById: (categoryId) => apiClient.get(`/admin/category/${categoryId}`),

    createCategory: (category) => {
        return apiClient.post("/admin/category", category, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },

    updateCategory: (id, category) => {
        return apiClient.put(`/admin/category/${id}`, category, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },

    deleteCategory: (id) => apiClient.delete(`/admin/category/${id}`),

    getAllCategoriesUS: () => apiClient.get("/user/category"),
};

export default CategoriesService;