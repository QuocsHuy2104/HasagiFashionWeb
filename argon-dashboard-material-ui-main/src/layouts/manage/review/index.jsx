import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Footer from "../../../examples/Footer";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import ReviewsService from "../../../services/ReviewsServices";
import { CheckCircle, Cancel } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReviewFilesService from '../../../services/ReviewFileServices';
import { Modal, Box } from '@mui/material';

function Review() {
    const [reviews, setReviews] = useState([]);
    const [reviewFiles, setReviewFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const [mediaUrl, setMediaUrl] = useState('');
    const [errors, setErrors] = useState({
        adminFeedBack: false,
    });
    const [formData, setFormData] = useState({
        id: null,
        adminFeedBack: "",
    });

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await ReviewsService.getAllReviewsAD();
                setReviews(response.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchReviewFileData = async () => {
            try {
                const response = await ReviewFilesService.getAllFileReviews();
                setReviewFiles(response.data);

            } catch (err) {
                console.log(err);
            }
        };
        fetchReviewData();
        fetchReviewFileData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'adminFeedBack' && value.trim() !== '') {
            setErrors({
                ...errors,
                adminFeedBack: '',
            });
        }
    };


    const validateForm = () => {
        const newErrors = { adminFeedBack: false };
        if (!formData.adminFeedBack.trim()) {
            newErrors.adminFeedBack = true;
            toast.warn("Phản hồi thất bại.");
        }
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            let result;
            const formDataToSend = new FormData();
            formDataToSend.append("adminFeedback", formData.adminFeedBack);
            if (formData.id) {
                result = await ReviewsService.feedBackReview(formData.id, formDataToSend);
                setReviews(reviews.map(review => review.id === result.data.id ? result.data : review));
                resetForm();
                toast.success("Phản hồi thành công!");
            } else {
                toast.error("Phản hồi đánh giá không thành công");
            }
        } catch (error) {
            if (error.response) {
                toast.error(`Lỗi: ${error.response.data.message || error.response.data}`);
            } else {
                toast.error(`Lỗi: ${error.message}`);
            }
        }
    };


    const resetForm = () => {
        setFormData({
            id: null, // Reset id
            adminFeedBack: "",
        });
        setErrors({ adminFeedBack: false });
    };

    const handleFeedbackClick = (review) => {
        setFormData({
            id: review.id,
            adminFeedBack: review.adminFeedback || "",
        });
    };

    const handleFeedbackClickInternal = (review) => {
        if (formData.id === review.id) {
            setFormData({ ...formData, id: null });
        } else {
            setFormData({ ...formData, id: review.id });
        }
    };


    const handleDeleteClick = async (id) => {
        try {
            await ReviewsService.deleteReviewAD(id);
            setReviews(reviews.filter(review => review.id !== id));
            toast.success("Review deleted successfully");
        } catch (error) {
            console.error("Error deleting review", error);
            toast.error("Error deleting review");
        }
    };

    const handleOpen = (url) => {
        setMediaUrl(url);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setMediaUrl('');
    };
    return (
        <DashboardLayout>
            <ToastContainer />
            <DashboardNavbar />
            <ArgonBox py={-3}>
                <ArgonBox mt={-1}>
                    {reviews.map(review => {
                        return (
                            <Card key={review.id} style={{ marginBottom: '20px', padding: '20px', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                <ArgonTypography variant="h5" style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Review Details</ArgonTypography>
                                <ArgonBox display="flex" gap="2px" flexWrap="wrap" >
                                    {Array.from(new Set(reviewFiles.filter((file) => file.reviewId === review.id && file.videoUrl)
                                        .map((file) => file.videoUrl)))
                                        .map((videoUrl, index) => (
                                            <ArgonBox key={index} style={{ position: 'relative' }}>
                                                <video
                                                    width="150"
                                                    height="150"
                                                    style={{
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        objectFit: 'cover',
                                                    }}
                                                    onClick={() => handleOpen(videoUrl)}
                                                >
                                                    <source src={videoUrl} type="video/mp4" />
                                                </video>
                                                <div
                                                    onClick={() => handleOpen(videoUrl)}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '70px',
                                                        left: '60px',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                        borderRadius: '50%',
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        width: '30px',
                                                        height: '30px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <i className="fas fa-play" style={{ color: 'white', fontSize: '16px', }}></i>
                                                </div>
                                            </ArgonBox>
                                        ))}
                                    {reviewFiles.filter((file) => file.reviewId === review.id && file.imageUrl).map((file) => (
                                        <ArgonBox key={file.id}>
                                            {file.imageUrl && (
                                                <img
                                                    src={file.imageUrl}
                                                    alt="Review"
                                                    style={{
                                                        width: '150px',
                                                        height: '150px',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        objectFit: 'cover',
                                                    }}
                                                    onClick={() => handleOpen(file.imageUrl)}
                                                />
                                            )}
                                        </ArgonBox>
                                    ))}
                                </ArgonBox>
                                <ArgonBox display="flex" alignItems="center" style={{ marginBottom: '15px' }}>
                                    <ArgonBox>
                                        <ArgonTypography variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <strong style={{ marginRight: '5px' }}>Bình luận: </strong> {review.comment}
                                        </ArgonTypography>
                                        <ArgonTypography variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <strong style={{ marginRight: '5px' }}>Đánh giá: </strong> {review.star} ⭐
                                        </ArgonTypography>
                                        <ArgonTypography variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <strong style={{ marginRight: '5px' }}>Ngày đánh giá: </strong> {new Date(review.createdAt).toLocaleDateString()}
                                        </ArgonTypography>
                                        <ArgonTypography
                                            variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <strong>Phản hổi: </strong>&nbsp;
                                            {review.adminFeedback ? (
                                                <>
                                                    <CheckCircle style={{ color: '#4caf50', marginRight: '5px' }} />
                                                    Đã phản hồi
                                                </>
                                            ) : (
                                                <>
                                                    <Cancel style={{ color: '#f44336', marginRight: '5px' }} />
                                                    Chưa phản hồi
                                                </>
                                            )}
                                        </ArgonTypography>
                                    </ArgonBox>
                                </ArgonBox>
                                <ArgonBox display="flex" justifyContent="flex-end" gap="10px">
                                    <ArgonButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleFeedbackClickInternal(review)}
                                        style={{ minWidth: '100px', borderRadius: '8px' }}
                                    >
                                        Phản hồi
                                    </ArgonButton>
                                    <ArgonButton
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteClick(review.id)}
                                        style={{ minWidth: '100px', borderRadius: '8px' }}
                                    >
                                        Xóa bình luận
                                    </ArgonButton>
                                </ArgonBox>

                                {formData.id === review.id && ( // Chỉ hiển thị form nếu formData.id trùng với review.id
                                    <form onSubmit={handleSubmit}>
                                        <ArgonBox mb={-1} mt={5} display="flex" justifyContent="space-between" alignItems="center">
                                            <ArgonInput
                                                name="adminFeedBack"
                                                placeholder="Nhập phản hồi"
                                                value={formData.adminFeedBack}
                                                onChange={handleChange}
                                                error={!!errors.adminFeedBack} // Hiển thị lỗi khi có lỗi
                                                style={{ flex: 1 }}
                                            />
                                            <ArgonButton
                                                type="submit"
                                                variant="contained"
                                                color="info"
                                                style={{ marginLeft: 10 }}
                                            >
                                                Gửi
                                            </ArgonButton>
                                        </ArgonBox>

                                        {errors.adminFeedBack && (
                                            <ArgonTypography color="error" variant="caption" mt={0}>
                                                Bạn chưa nhập phản hồi
                                            </ArgonTypography>
                                        )}

                                    </form>

                                )}

                            </Card>
                        );
                    })}
                </ArgonBox>
                <Modal open={open} onClose={handleClose}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '5px',
                        boxShadow: 24,
                    }}>
                        {mediaUrl && mediaUrl.includes('firebasestorage.googleapis.com') ? (
                            mediaUrl.includes('.mp4') ? (
                                <video width="100%" controls>
                                    <source src={mediaUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={mediaUrl} alt="Review" style={{ width: '100%', height: 'auto', borderRadius: '5px' }} />
                            )
                        ) : null}
                    </Box>
                </Modal>
            </ArgonBox>
            <Footer />
        </DashboardLayout>
    );
}
export default Review;