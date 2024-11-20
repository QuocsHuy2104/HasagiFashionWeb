
import apiClient from "config/axiosConfig";

const ImageService = {

    getAllImages: () => {
        return apiClient.get("/admin/image");
    },

    getImageById: (imageId) => apiClient.get(`/admin/image/${imageId}`),

    create: data => apiClient.post('/admin/image', data),

    update: (id, data) => apiClient.put('/admin/image/${id}', data),

    deleteImage: (id) => apiClient.delete(`/admin/image/${id}`),

    getByProductDetailId: productDetailId => apiClient.get(`/admin/image/product-detail/${productDetailId}`),
};

export default ImageService;
