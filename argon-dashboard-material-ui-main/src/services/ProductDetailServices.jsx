import apiClient from "config/axiosConfig";

const ProductDetailService = {

    getAllProductDetails: () => apiClient.get('/admin/product-detail'),

    getAllByProductId: async (id) => {
        try {
            const response = await apiClient.get(`/admin/product-detail/product/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw new Error("Không thể lấy chi tiết sản phẩm. Vui lòng thử lại.");
        }
    },

    createDetail: async (data) => {
        const response = await apiClient.post('/admin/product-detail', data);
        return response.data;
    },

    updateDetail: async (id, data) => {
        try {
            const response = await apiClient.put(`/admin/product-detail/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating product detail:", error);
            throw new Error("Không thể cập nhật chi tiết sản phẩm. Vui lòng thử lại.");
        }
    },


};

export default ProductDetailService;
