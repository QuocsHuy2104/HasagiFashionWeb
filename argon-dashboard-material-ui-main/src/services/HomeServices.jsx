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
    },
    addToCartPopup: async data => {
        try {
            return await apiClient.post('/web/small-cart', data)
        } catch (e) {
            console.error('Add to cart failed:', e);
            throw error;
        }
    },
    getCartByAccount: () => apiClient.get('/web/small-cart'),
    getCategoryHeader: () => apiClient.get('/public/home/category'),
    getProductSale: () => apiClient.get('/public/home/top-discounts'),
    buyQuickly: id => apiClient.post(`/web/small-cart/buy-quickly/${id}`)


}

export default HomeService;