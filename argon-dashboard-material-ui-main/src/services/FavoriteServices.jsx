import apiClient from "config/axiosConfig";

const FavoriteService = {
    create: productId => apiClient.post('/api/favorites', productId),
    remove: productId => apiClient.delete(`/api/favorites/${productId}`),
    getByAccount: () => apiClient.get('/api/favorites/user'),
    countFavorite: () => apiClient.get('api/favorites/count/account')
}

export default FavoriteService;