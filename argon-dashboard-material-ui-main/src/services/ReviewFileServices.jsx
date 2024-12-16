
import apiClient from "config/axiosConfig"; 

const ReviewFilesService = {
    getAllFileReviews: () => apiClient.get("/review-file"),
    createFileReviews: (fileReview) => apiClient.post("/review-file", fileReview),
    getFileReviewsByReviewId: (reviewId) => apiClient.get(`/review-file/review/${reviewId}`), 
    
};

export default ReviewFilesService;
