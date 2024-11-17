
import apiClient from "config/axiosConfig"; 

const ReviewFilesService = {
    //user
    getAllFileReviews: () => apiClient.get("/user/review-file"),
    createFileReviews: (fileReview) => apiClient.post("/user/review-file", fileReview),
    getFileReviewsByReviewId: (reviewId) => apiClient.get(`/user/review-file/review/${reviewId}`), 
    //admin
    getAllFileReviewsAD: () => apiClient.get("/admin/review-file"),
};

export default ReviewFilesService;
