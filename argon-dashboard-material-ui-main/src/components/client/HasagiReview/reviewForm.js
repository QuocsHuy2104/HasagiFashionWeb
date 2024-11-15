import React, { useState } from 'react';
import Videocam from '@mui/icons-material/Videocam'; // Biểu tượng máy quay phim
import { Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Biểu tượng máy ảnh
import reviewsService from "services/ReviewsServices";
import { Modal as BootstrapModal, Button as BootstrapButton } from 'react-bootstrap';
import ArgonButton from 'components/ArgonButton';
import HistoryOrderService from "../../../services/HistoryOrderServices";
import { Modal as MuiModal, Button as MuiButton, Box, Tabs, Tab, Paper, Grid, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";

const ReviewForm = () => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [star, setStar] = useState(5);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [orderDetailId, setOrderDetailId] = useState(null);

    const [orders, setOrders] = useState([]);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    //review
    const handleReviewClick = (product) => {
        setSelectedProduct(product);
        setShowReviewModal(true);
        console.log(product);
        const orderDetailId = product?.orderDetailId;
        setOrderDetailId(orderDetailId);
        console.log("Selected OrderDetailId:", orderDetailId);
    };


    const handleClose = () => setShowReviewModal(false);

    const handleStarClick = (index) => {
        setStar(index + 1);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); // Set the actual file to be used in form submission
            setImagePreview(URL.createObjectURL(file)); // Create a preview URL to display the image
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file); // Set the actual file to be used in form submission
            setVideoPreview(URL.createObjectURL(file)); // Create a preview URL to display the video
        }
    };


    const resetImageInput = () => {
        setImage(null); // Reset state của ảnh
        setImagePreview(null); // Reset preview ảnh
        const imageInput = document.getElementById('image-upload');
        if (imageInput) {
            imageInput.value = ''; // Reset giá trị input
        }
    };

    const resetVideoInput = () => {
        setVideo(null); // Reset state của video
        setVideoPreview(null); // Reset preview video
        const videoInput = document.getElementById('video-upload');
        if (videoInput) {
            videoInput.value = ''; // Reset giá trị input
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderDetailId) {
            alert("Order Detail ID không hợp lệ!");
            return;
        }

        const formData = new FormData();
        formData.append('star', star);
        formData.append('comment', comment);
        formData.append('orderDetailId', orderDetailId);

        if (image) {
            formData.append('image', image);
        }
        if (video) {
            formData.append('video', video);
        }

        try {
            const swal = Swal.fire({
                title: 'Đang xử lý...',
                width: 500,
                height: 300,
                padding: "1em",
                color: "white",
                background: "transparent",
                showConfirmButton: false,
                allowOutsideClick: false,
                customClass: {
                    popup: 'custom-popup',
                },
                didOpen: () => {
                    const popup = document.querySelector('.swal2-popup');
                    popup.style.overflow = 'hidden';
                }
            });

            const response = await reviewsService.createReview(formData);
            console.log('Review created successfully:', response);
            setTimeout(() => {
                swal.update({
                    title: "Thành công!",
                    html: "Đánh giá thành công!",
                    icon: "success",
                    color: "black",
                    showConfirmButton: true,
                    customClass: {
                        popup: 'custom-popup',
                    },
                    didOpen: () => {
                        const popup = document.querySelector('.swal2-popup');
                        popup.style.overflow = 'hidden';
                    },
                    background: "#fff",
                });
            }, 2000);

            setStar(5);
            setComment('');
            resetImageInput();
            resetVideoInput();

        } catch (error) {
            console.error('Error creating review:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo đánh giá.';
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorMessage,
            });
        }

    };


    const filteredOrders = orders.filter(order => {
        if (activeTab !== 'all' && order.statusSlug !== activeTab) {
          return false;
        }
        if (searchQuery && !order.id.toString().includes(searchQuery)) {
          return false;
        }
        return true;
      });

    return (
        <>
            {filteredOrders.map((order) => (
                <Grid item xs={12} key={order.id}>
                    {order.products.map((product, index) => (
                        <ArgonButton
                            key={index}
                            variant="body2"
                            color="textSecondary"
                            onClick={() => handleReviewClick(product)}
                            style={{ marginLeft: "600px", color: "black" }}
                        >
                            Đánh giá
                        </ArgonButton>
                    ))}
                </Grid>
            ))}

            {selectedProduct && (
                <BootstrapModal show={showReviewModal} size="lg" onHide={handleClose}>
                    <BootstrapModal.Body>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                            }}
                        >
                            <p style={{ fontSize: '25px', margin: 0 }}>Đánh giá sản phẩm</p>
                            <IconButton onClick={handleClose} style={{ color: 'inherit' }}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <img
                                src={selectedProduct.productImage}
                                alt={selectedProduct.productName}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '5px',
                                    objectFit: 'cover',
                                    marginRight: '10px',
                                    border: '1px solid #ddd',
                                }}
                            />
                            <div>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                                    {selectedProduct.productName}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0 0 0' }}>
                                    <p style={{ color: '#888', margin: '0 15px 0 0', fontSize: '16px' }}>
                                        Màu: <span style={{ color: '#555' }}>{selectedProduct.color}</span>
                                    </p>
                                    <p style={{ color: '#888', margin: '0', fontSize: '16px' }}>
                                        Kích cỡ: <span style={{ color: '#555' }}>{selectedProduct.size}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ fontWeight: 'bold', marginRight: '50px', fontSize: '18px' }}>
                                    Chất lượng sản phẩm:
                                </label>
                                <div style={{ display: 'flex' }}>
                                    {[...Array(5)].map((_, index) => (
                                        <span
                                            key={index}
                                            onClick={() => handleStarClick(index)}
                                            style={{ cursor: 'pointer', marginRight: '20px' }}
                                        >
                                            {index < star ? (
                                                <StarIcon style={{ color: '#FFD700', transform: 'scale(2)' }} />
                                            ) : (
                                                <StarBorderIcon style={{ color: '#FFD700', transform: 'scale(2)' }} />
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                                <BootstrapButton
                                    variant="outlined"
                                    component="span"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #000',
                                        padding: '0',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '8px',
                                    }}
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    <PhotoCamera style={{ fontSize: '48px', color: 'black' }} />
                                </BootstrapButton>
                                {imagePreview && (
                                    <div style={{ position: 'relative', marginRight: '3px' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Selected"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <IconButton
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                right: '2px',
                                                padding: '0',
                                                color: '#fff',
                                                fontSize: '15px',
                                                backgroundColor: '#B8B8B8',
                                            }}
                                            onClick={resetImageInput}
                                        >
                                            <CloseIcon style={{ fontSize: '16px' }} />
                                        </IconButton>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="video-upload"
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    onChange={handleVideoChange}
                                />
                                {videoPreview ? (
                                    <div style={{ position: 'relative', marginTop: '10px' }}>
                                        <video
                                            src={videoPreview}
                                            controls
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <IconButton
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                right: '2px',
                                                padding: '0',
                                                color: '#fff',
                                                fontSize: '15px',
                                                backgroundColor: '#B8B8B8',
                                            }}
                                            onClick={resetVideoInput}
                                        >
                                            <CloseIcon style={{ fontSize: '16px' }} />
                                        </IconButton>
                                    </div>
                                ) : (
                                    <BootstrapButton
                                        variant="outlined"
                                        component="span"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid #000',
                                            padding: '0',
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '8px',
                                        }}
                                        onClick={() => document.getElementById('video-upload').click()}
                                    >
                                        <Videocam style={{ fontSize: '48px', color: 'black' }} />
                                    </BootstrapButton>
                                )}
                            </div>
                            <textarea
                                rows="4"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    border: '1px solid #888888',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                placeholder="Nhập đánh giá của bạn"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <BootstrapButton
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        color: '#000',
                                        backgroundColor: '#FFD700',
                                        borderColor: '#FFD700',
                                    }}
                                >
                                    Gửi đánh giá
                                </BootstrapButton>
                            </div>
                            <Snackbar
                                open={openSnackbar}
                                onClose={handleCloseSnackbar}
                                message={snackbarMessage}
                                autoHideDuration={6000}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            />
                        </form>
                    </BootstrapModal.Body>
                </BootstrapModal>
            )}
        </>

    );
};

export default ReviewForm;