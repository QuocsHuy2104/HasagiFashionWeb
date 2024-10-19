import apiClient from "config/axiosConfig";

const ProductService = {
  getAllProducts: () => apiClient.get('/admin/product'),
  getProductID: () => apiClient.get('/admin/product/${id}'),
  eateProduct: (productData) => apiClient.post('/admin/product', productData),
}

export default ProductService;