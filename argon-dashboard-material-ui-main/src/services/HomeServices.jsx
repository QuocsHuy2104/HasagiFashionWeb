import apiClient from "config/axiosConfig";

export default HomeService = {
    getBestSeller : () => apiClient.get('/public/home/best-seller')
}