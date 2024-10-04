import apiClient from "config/axiosConfig";

const ShopDetailService = {
    getAllShopDetail: () => apiClient.get('/cart/totalQuantity',{
        withCredentials: true
    }),

    getCategoryDetail: (categoryId) => apiClient.get(`/category/${categoryId}`),

    getProductDetail: (productId) => apiClient.get(`/product/${productId}`),

    checkFavorite: (productId) => apiClient.get("/favorites/check", {
        params: { productId },
        withCredentials: true
    }),

    addToCart: ({ accountId, colorId, sizeId, quantity, productId, price }) =>
        apiClient.post('/cart/add', {
            accountId,  
            colorId,
            sizeId,
            quantity,
            productId,
            price
        }, { withCredentials: true }),

    getFavoritesCount: (productId) =>
        apiClient.get('/favorites/count', {
            params: { productId },
            withCredentials: true
        }),
    addToFavorites: (productId) =>
        apiClient.post('/favorites', {
            productId
        }, { withCredentials: true }),
    
    removeFromFavorites: (productId) =>
        apiClient.delete(`/favorites/${productId}`, { 
            withCredentials: true 
        }),
};

export default ShopDetailService;


