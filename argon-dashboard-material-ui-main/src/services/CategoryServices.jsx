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

    updateCategory: (id, category) => apiClient.put(`/admin/category/${id}`, category),

    deleteCategory: (id) => apiClient.delete(`/admin/category/${id}`),

    //user
    getAllCategoriesUS: () => apiClient.get("/user/category"),
};

export default CategoriesService;