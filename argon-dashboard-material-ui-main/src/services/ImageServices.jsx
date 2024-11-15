
import apiClient from "config/axiosConfig";

const ImageService = {
    getAllImages: () => {
        return apiClient.get("/admin/image");
    },

    getImageById: (imageId) => apiClient.get(`/admin/image/${imageId}`),

    createImage: (image) => {
        return apiClient.post(`/admin/image`, image, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    updateImage: (id, image) => {
        return apiClient.put(`/admin/image/${id}`, image, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Xóa ảnh theo ID
    deleteImage: (id) => apiClient.delete(`/admin/image/${id}`),
};

export default ImageService;
