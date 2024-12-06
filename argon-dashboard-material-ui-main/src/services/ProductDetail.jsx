import apiClient from "config/axiosConfig";

const ShopDetailService = {
    getAllShopDetail: () => apiClient.get('/cart/totalQuantity', {
        withCredentials: true
    }),


    getCategoryDetail: (categoryId) => apiClient.get(`/category/${categoryId}`),

    getProductDetail: ({ productId, sizeId, colorId }) => {
        const url = [
            `/public/webShopDetail/${productId}`,
            sizeId ? `?selectedSizeId=${sizeId}` : '',
            colorId ? (sizeId ? `&selectedColorId=${colorId}` : `?selectedColorId=${colorId}`) : ''
        ].join('');
        return apiClient.get(url);
    },


    checkFavorite: (productId) => {
        return apiClient.get("/favorites/check", {
            params: { productId },
            withCredentials: true
        });
    },

    getAllFavorites: () => apiClient.get('/favorites/count/account', {
        withCredentials: true
    }),


    getGotoFavorites: () => apiClient.get('/favorites/user', {
        withCredentials: true
    }),


    addToCart: ({ colorId, sizeId, quantity, productId, price }) => {
        return apiClient.post('/cart/add', {
            colorId,
            sizeId,
            quantity,
            productId,
            price
        }, { withCredentials: true })
    },

    getFavoritesCount: (productId) =>
        apiClient.get('/favorites/count', {
            params: { productId },
            withCredentials: true
        }
    ),

    addToFavorites: (productId) =>
        apiClient.post('/favorites', {
            productId
        }, { withCredentials: true }
    ),

    removeFromFavorites: (productId) =>
        apiClient.delete(`/favorites/${productId}`, {
            withCredentials: true
        }
    ),
};

export default ShopDetailService;


