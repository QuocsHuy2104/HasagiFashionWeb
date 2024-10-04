
import apiClient from "config/axiosConfig";

const ImageService = {
    // Lấy danh sách tất cả ảnh
    getAllImages: () => {
        return apiClient.get("/admin/image");
    },

    // Lấy chi tiết ảnh theo ID
    getImageById: (imageId) => apiClient.get(`/admin/image/${imageId}`),

    // Tạo mới một ảnh
    createImage: (image) => {
        // Đảm bảo rằng FormData được gửi qua API
        return apiClient.post(`/admin/image`, image, { // Thêm tùy chọn headers nếu cần
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Cập nhật ảnh theo ID
    updateImage: (id, image) => {
        // 'image' cần là một đối tượng FormData khi cập nhật
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
