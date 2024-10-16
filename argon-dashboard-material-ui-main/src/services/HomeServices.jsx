import apiClient from "config/axiosConfig";

const  HomeService = {
    getBestSeller : () => apiClient.get('/public/home/best-seller'),
    getNewProducts: () => apiClient.get('/public/home/products/newest')
}

export default HomeService;