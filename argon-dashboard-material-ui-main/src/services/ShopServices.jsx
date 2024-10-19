import apiClient from "config/axiosConfig";

const  ShopService = {
    getBrandHome: () => apiClient.get("/public/shop/brand"),
    getBrandById: (brandId) => apiClient.get(`public/shop/brand/${brandId}`),

    getCateHome: () => apiClient.get("/public/shop/cate"),
    getCategoryById: async (categoryId) => {
        try {
            const response = await apiClient.get(`/public/shop/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category with ID ${categoryId}:`, error);
            throw error;
        }
    },
    getProductHome: () => apiClient.get('/public/shop/pd-seller'),
}

export default ShopService;