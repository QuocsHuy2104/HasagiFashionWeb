import apiClient from "config/axiosConfig";

const ProductService = {
  getAllProducts: () => apiClient.get('/admin/product'),
  
  getProductID: (id) => apiClient.get(`/admin/product/${id}`),

  createProduct: (productData) => apiClient.post('/admin/product', productData),

  updateProduct: (id, updatedData) => apiClient.put(`/admin/product/${id}`, updatedData),
}

export default ProductService;
