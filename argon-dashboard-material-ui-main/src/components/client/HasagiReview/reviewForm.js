import React, { useState } from 'react';
import reviewsService from '../../../services/ReviewServices'; // Đường dẫn đến file reviewsService
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Biểu tượng máy ảnh
import Videocam from '@mui/icons-material/Videocam'; // Biểu tượng máy quay phim
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Snackbar } from '@mui/material'; // Thêm Snackbar cho thông báo

const ReviewForm = () => {
    const [star, setStar] = useState(5);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Trạng thái cho Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Tin nhắn cho Snackbar


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

        const formData = new FormData();
        formData.append('star', star);
        formData.append('comment', comment);
        formData.append('productId', selectedProduct.productId); // Thêm productId vào formData
        if (image) {
            formData.append('image', image);
        }
        if (video) {
            formData.append('video', video);
        }

        try {
            const response = await reviewsService.createReview(formData);
            console.log('Review created successfully:', response);
            // Reset fields after successful submission
            setStar(0);
            setComment('');
            resetImageInput();
            resetVideoInput();
            setSnackbarMessage('Đánh giá đã được gửi thành công!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error creating review:', error.response.data);
            alert('Có lỗi xảy ra khi tạo đánh giá. Vui lòng kiểm tra thông tin và thử lại.');
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '50px', fontSize: '18px' }}>Chất lượng sản phẩm:</label>

                <div style={{ display: 'flex' }}>
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            onClick={() => handleStarClick(index)}
                            style={{ cursor: 'pointer', marginRight: '20px' }}
                        >
                            {index < star ? (
                                <StarIcon style={{ color: '#FFD700', transform: 'scale(2)' }} /> // Increase the scale size
                            ) : (
                                <StarBorderIcon style={{ color: '#FFD700', transform: 'scale(2)' }} />
                            )}
                        </span>
                    ))}
                </div>
            </div>


            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                {/* Nút Tải lên hình ảnh */}
                <div style={{ marginRight: '5px' }}>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <Button
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
                        <PhotoCamera style={{ fontSize: '48px', color: 'black' }} /> {/* Tăng kích thước icon */}
                    </Button>
                </div>

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
                            onClick={resetImageInput} // Gọi hàm reset ảnh
                        >
                            <CloseIcon style={{ fontSize: '16px' }} />
                        </IconButton>

                    </div>
                )}


                {/* Nút Tải lên video */}
                <div style={{ marginLeft: '1px' }}>
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
                        <Button
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
                            <Videocam style={{ fontSize: '48px', color: 'black' }} /> {/* Tăng kích thước icon */}
                        </Button>
                    )}
                </div>
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
                <Button
                    type="submit"
                    variant="contained"
                    style={{
                        color: '#000',
                        backgroundColor: '#FFD700', // Yellow color for the Gửi đánh giá button
                        borderColor: '#FFD700',
                    }}
                >
                    Gửi đánh giá
                </Button>
            </div>


            <Snackbar
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Aligns the Snackbar to the bottom-right corner
            />

        </form>
    );
};

export default ReviewForm;