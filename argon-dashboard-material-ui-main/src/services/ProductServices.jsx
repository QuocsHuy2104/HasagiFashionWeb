import apiClient from "config/axiosConfig";

const ProductService = {
  getAllProducts: () => apiClient.get('/product'),
  getProductID: () => apiClient.get('/product/${id}')
}

export default ProductService;