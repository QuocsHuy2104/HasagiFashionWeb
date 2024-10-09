import apiClient from "config/axiosConfig";

const  HomeService = {
    getBestSeller : () => apiClient.get('/public/home/best-seller')
}

export default HomeService;