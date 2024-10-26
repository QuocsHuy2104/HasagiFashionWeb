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
import { toast } from "react-toastify";
import { CheckCircle, Cancel } from '@mui/icons-material';


function Review() {
    const [reviews, setReviews] = useState([]);
    const [errors, setErrors] = useState({
        adminFeedBack: false,
    });
    const [formData, setFormData] = useState({
        id: null,
        adminFeedBack: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ReviewsService.getAllReviewsAD();
                setReviews(response.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = { adminFeedBack: false };
        if (!formData.adminFeedBack.trim()) {
            newErrors.adminFeedBack = true;
            toast.error("Admin response is required.");
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

                toast.success("Admin response saved successfully");
                resetForm();
            } else {
                toast.error("ID is required to update the review.");
                return;
            }
        } catch (error) {
            toast.error(`Error: ${error.response ? error.response.data : error.message}`);
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

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" p={3}>
                            <ArgonTypography variant="h6">Manage Review</ArgonTypography>
                        </ArgonBox>
                        <ArgonBox
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems="center"
                            p={3}
                            component="form"
                            role="form"
                            onSubmit={handleSubmit}
                        >
                            <ArgonBox width={{ xs: '100%' }}>
                                <ArgonBox mb={3}>
                                    <ArgonInput
                                        type="text"
                                        placeholder="Nhập phản hồi"
                                        size="large"
                                        name="adminFeedBack"
                                        fullWidth
                                        value={formData.adminFeedBack}
                                        onChange={handleChange}
                                        error={errors.adminFeedBack}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderColor: errors.adminFeedBack ? 'red' : 'default',
                                            },
                                        }}
                                    />
                                    {errors.adminFeedBack && (
                                        <ArgonTypography color="error" variant="caption">
                                            Admin response is required.
                                        </ArgonTypography>
                                    )}
                                </ArgonBox>

                                <ArgonButton
                                    type="submit"
                                    variant="contained"
                                    color="info"
                                    size="large"
                                    disabled={!formData.id}
                                >
                                    {formData.id ? "Phản hồi" : "Phản hồi"}
                                </ArgonButton>

                            </ArgonBox>
                        </ArgonBox>
                    </Card>
                </ArgonBox>

                {/* Reviews Display */}
                <ArgonBox mt={3}>
                    {reviews.map(review => {
                        const imageUrl = `http://localhost:3000/${review.imageUrl}`;
                        const videoUrl = `http://localhost:3000/${review.videoUrl}`;

                        return (
                            <Card key={review.id} style={{ marginBottom: '20px', padding: '20px', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                <ArgonTypography variant="h5" style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>Review Details</ArgonTypography>
                                <ArgonBox display="flex" alignItems="center" style={{ marginBottom: '15px' }}>
                                    {/* Display Image if available */}
                                    {review.imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="Review"
                                            style={{
                                                maxWidth: '150px',
                                                height: '150px',
                                                marginRight: '15px',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                            }}
                                        />
                                    )}
                                    {/* Display Video if available */}
                                    {review.videoUrl && (
                                        <video
                                            controls
                                            style={{
                                                maxWidth: '150px',
                                                height: '150px',
                                                marginRight: '15px',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                            }}
                                        >
                                            <source src={videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                    <ArgonBox>
                                        <ArgonTypography variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <strong style={{ marginRight: '5px' }}>Comment: </strong> {review.comment}
                                        </ArgonTypography>
                                        <ArgonTypography variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <strong style={{ marginRight: '5px' }}>Star Rating: </strong> {review.star} ⭐
                                        </ArgonTypography>
                                        <ArgonTypography variant="body1"
                                            style={{
                                                fontSize: '16px',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <strong style={{ marginRight: '5px' }}>Created At: </strong> {new Date(review.createdAt).toLocaleDateString()}
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
                                            <strong>Admin Feedback: </strong>&nbsp;
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
                                        onClick={() => handleFeedbackClick(review)}
                                        style={{ minWidth: '100px', borderRadius: '8px' }}
                                    >
                                        Feedback
                                    </ArgonButton>
                                    <ArgonButton
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteClick(review.id)}
                                        style={{ minWidth: '100px', borderRadius: '8px' }}
                                    >
                                        Delete
                                    </ArgonButton>
                                </ArgonBox>
                            </Card>

                        );
                    })}
                </ArgonBox>
            </ArgonBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Review;