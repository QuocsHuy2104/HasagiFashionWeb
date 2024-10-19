import apiClient from "config/axiosConfig";

const HomeService = {
    getBestSeller: () => apiClient.get('/public/home/best-seller'),
    getNewProducts: () => apiClient.get('/public/home/products/newest'),
    getProductDetailPopup: async (id) => {
        try {
            const response = await apiClient.get(`/public/home/product-dt/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    },
    getProductPopupById: async (id) => {
        try {
            const response = await apiClient.get(`/public/home/product-popup/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product popup by id:', error);
            throw error;
        }
    }
}

export default HomeService;