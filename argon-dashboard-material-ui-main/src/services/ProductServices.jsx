import apiClient from "config/axiosConfig";

const ProductService = {
  getAllProducts: () => apiClient.get('/product'),
  getProductHome: () => apiClient.get('/public/home/pd-seller'),
  getProductID: () => apiClient.get('/product/${id}')
}

export default ProductService;