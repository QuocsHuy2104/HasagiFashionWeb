import apiClient from "config/axiosConfig";

const CategoriesService = {

    
    getAllCategories: async () => {
        try {
            const response = await apiClient.get("/admin/category");
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const response = await apiClient.get(`/admin/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category with ID ${categoryId}:`, error);
            throw error;
        }
    },

    createCategory: async (category) => {
        try {
            const response = await apiClient.post("/admin/category", category);
            return response.data;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    },

    updateCategory: async (id, category) => {
        try {
            const response = await apiClient.put(`/admin/category/${id}`, category);
            return response.data;
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/category/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            throw error;
        }
    },

    
};


export default CategoriesService;


