import apiClient from "config/axiosConfig";

const ProductService = {
  getAllProducts: () => apiClient.get('/admin/product'),
  getProductID: () => apiClient.get('/admin/product/${id}'),
  createProduct: (productData) => apiClient.post('/admin/product', productData),
  updateProduct: (id, productData) => apiClient.put(`/admin/product/${id}`, productData),
  updateQuantity: (id) => apiClient.put(`/admin/product/quantity/${id}`),

}

export default ProductService;