import apiClient from "config/axiosConfig";

const  ShopService = {
    getBrandHome: () => apiClient.get("/public/shop/brand"),
    getCateHome: () => apiClient.get("/public/shop/cate"),
    getProductHome: () => apiClient.get('/public/shop/pd-seller'),
}

export default ShopService;