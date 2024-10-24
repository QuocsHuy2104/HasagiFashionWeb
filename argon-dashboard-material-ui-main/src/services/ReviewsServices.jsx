import apiClient from "config/axiosConfig";

const reviewsService = {
    //web
    async getAllReviews() {
        const response = await apiClient.get("/user/review");
        return response.data;
    },

    async createReview(reviewData) {
        try {
            const response = await apiClient.post("/user/review", reviewData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    async getReviewsByProduct(productId) {
        const response = await apiClient.get(`/user/review/product/${productId}`);
        return response.data;
    },



    getAllReviewsAD: () => apiClient.get("/admin/review"),

    getReviewById: (reviewId) => apiClient.get(`/admin/review/${reviewId}`),

    feedBackReview: (id, review) => apiClient.put(`/admin/review/${id}`, review),

    deleteReviewAD: (id) => apiClient.delete(`/admin/review/${id}`),


    async getReviewsByProductAD(productId) {
        try {
            const response = await apiClient.get(`/admin/review/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reviews for product with ID ${productId}:`, error);
            throw error;
        }
    },


    async getReviewsByAccountAD(accountId) {
        try {
            const response = await apiClient.get(`/admin/review/account/${accountId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reviews for account with ID ${accountId}:`, error);
            throw error;
        }
    },

};

export default reviewsService;