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
        feedbackDate: "",
    });
    const [filterStar, setFilterStar] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');


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

    const filterReviews = (reviews) => {
        return reviews.filter(review => {
            // Lọc theo số sao
            if (filterStar && review.star !== parseInt(filterStar)) {
                return false;
            }

            // Lọc theo trạng thái (đã phản hồi hay chưa)
            if (filterStatus === 'Đã phản hồi' && !review.adminFeedback) {
                return false;
            }
            if (filterStatus === 'Chưa phản hồi' && review.adminFeedback) {
                return false;
            }

            // Lọc theo ngày
            if (filterStartDate && new Date(review.createdAt) < new Date(filterStartDate)) {
                return false;
            }
            if (filterEndDate && new Date(review.createdAt) > new Date(filterEndDate)) {
                return false;
            }

            return true;
        });
    };


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
            id: null,
            adminFeedBack: "",
        });
        setErrors({ adminFeedBack: false });
    };

    const handleFeedbackClickInternal = (review) => {
        if (formData.id === review.id) {
            setFormData({ ...formData, id: null });
        } else {
            setFormData({ ...formData, id: review.id });
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} | ${hours}:${minutes} ${ampm}`;
    }

    const renderStars = (starCount) => {
        return Array.from({ length: starCount }, (_, index) => (
            <span key={index} role="img" aria-label="star">
                ⭐
            </span>
        ));
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
            <ArgonBox py={3}>
                <ArgonBox mb={5}>
                    <Card>
                        <ArgonBox
                            p={2}
                            display="flex"
                            justifyContent="space-evenly"
                            alignItems="center"
                            borderRadius="8px"
                            bgcolor="#f9f9f9"
                        >
                            {/* Lọc theo số sao */}
                            <ArgonBox width="22%">
                                <select
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        fontSize: "14px",
                                        color: "#555",
                                    }}
                                    value={filterStar}
                                    onChange={(e) => setFilterStar(e.target.value)}
                                >
                                    <option value="">Chọn số sao</option>
                                    <option value="">Tất cả</option>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <option key={star} value={star}>
                                            {renderStars(star)} {/* Hiển thị các sao */}
                                        </option>
                                    ))}
                                </select>
                            </ArgonBox>

                            {/* Lọc theo trạng thái */}
                            <ArgonBox width="22%">
                                <select
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        fontSize: "14px",
                                        color: "#555",
                                    }}
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Trạng thái</option>
                                    <option value="">Tất cả</option>
                                    <option value="Đã phản hồi">Đã phản hồi</option>
                                    <option value="Chưa phản hồi">Chưa phản hồi</option>
                                </select>
                            </ArgonBox>

                            {/* Lọc theo ngày bắt đầu */}
                            <ArgonBox width="22%">
                                <ArgonInput
                                    type="date"
                                    placeholder="Ngày bắt đầu"
                                    size="large"
                                    sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                    value={filterStartDate}
                                    onChange={(e) => setFilterStartDate(e.target.value)}
                                />
                            </ArgonBox>

                            {/* Lọc theo ngày kết thúc */}
                            <ArgonBox width="22%">
                                <ArgonInput
                                    type="date"
                                    placeholder="Ngày kết thúc"
                                    size="large"
                                    sx={{ bgcolor: 'white', borderRadius: '8px', width: '100%' }}
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                />
                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox >

                <ArgonBox mt={-1}>
                    {filterReviews(reviews).map(review => {
                        return (
                            <Card key={review.id} style={{ marginBottom: '20px', padding: '20px', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                <ArgonTypography variant="h5" style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Đánh giá chi tiết</ArgonTypography>
                                <ArgonBox display="flex" gap="2px" flexWrap="wrap" >
                                    {Array.from(new Set(reviewFiles.filter((file) => file.reviewId === review.id && file.videoUrl)
                                        .map((file) => file.videoUrl)))
                                        .map((videoUrl, index) => (
                                            <ArgonBox key={index} style={{ position: 'relative' }}>
                                                <video
                                                    width="120"
                                                    height="120"
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
                                                        bottom: '55px',
                                                        left: '45px',
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
                                                        width: '120px',
                                                        height: '120px',
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
                                            <strong style={{ marginRight: '5px' }}>Đánh giá: </strong> {renderStars(review.star)}
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
                                            <strong style={{ marginRight: '5px' }}>Ngày đánh giá:</strong>{' '}
                                            {formatDate(review.createdAt)}
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
                                            <strong>Trạng thái: </strong>&nbsp;
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
                                        <ArgonTypography
                                            variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {review.adminFeedback ? (
                                                <>
                                                    <strong style={{ marginRight: '5px' }}>Phản hồi: </strong>  {review.adminFeedback}
                                                </>
                                            ) : (
                                                <>
                                                    <></>
                                                </>
                                            )}

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
                                            {review.adminFeedback ? (
                                                <>
                                                    <strong style={{ marginRight: '5px' }}>Ngày phản hồi: </strong> {formatDate(review.feedbackDate)}

                                                </>
                                            ) : (
                                                <>
                                                    <></>
                                                </>
                                            )}
                                        </ArgonTypography>
                                    </ArgonBox>
                                </ArgonBox>
                                <ArgonBox display="flex" justifyContent="flex-end" gap="10px">
                                    {!review.adminFeedback && (
                                        <ArgonButton
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleFeedbackClickInternal(review)}
                                            style={{ minWidth: '100px', borderRadius: '8px' }}
                                        >
                                            Phản hồi
                                        </ArgonButton>
                                    )}
                                </ArgonBox>


                                {formData.id === review.id && (
                                    <form onSubmit={handleSubmit}>
                                        <ArgonBox mb={-1} mt={5} display="flex" justifyContent="space-between" alignItems="center">
                                            <ArgonInput
                                                name="adminFeedBack"
                                                placeholder="Nhập phản hồi"
                                                value={formData.adminFeedBack}
                                                onChange={handleChange}
                                                error={!!errors.adminFeedBack}
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
                        boxShadow: 24,
                        width: '60%',
                        maxWidth: '500px',
                    }}>
                        {mediaUrl && mediaUrl.includes('firebasestorage.googleapis.com') ? (
                            mediaUrl.includes('.mp4') ? (
                                <video width="100%" controls>
                                    <source src={mediaUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={mediaUrl} alt="Review" style={{ width: '100%', height: 'auto' }} />
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