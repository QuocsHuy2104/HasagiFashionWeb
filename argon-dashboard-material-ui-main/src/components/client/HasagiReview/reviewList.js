import React, { useEffect, useState } from 'react';
import reviewsService from 'services/ReviewsServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { Modal, Box } from '@mui/material';
import ReviewFilesService from '../../../services/ReviewFileServices';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedStar, setSelectedStar] = useState(null);
    const [open, setOpen] = useState(false);
    const [mediaUrl, setMediaUrl] = useState('');
    const [expandedReviewId, setExpandedReviewId] = useState(null);
    const [showOnlyWithMedia, setShowOnlyWithMedia] = useState(false);
    const [reviewFiles, setReviewFiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchReviewsAndFiles = async () => {
            try {
                const query = new URLSearchParams(window.location.search);
                const productId = query.get('id');

                if (productId) {
                    const productReviews = await reviewsService.getReviewsByProduct(productId);
                    setReviews(Array.isArray(productReviews) ? productReviews.sort((a, b) => b.star - a.star) : []);
                }

                const response = await ReviewFilesService.getAllFileReviews();
                setReviewFiles(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchReviewsAndFiles();
    }, []);

    const handleToggleExpand = (reviewId) => {
        setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId);
    };

    const handleOpen = (url) => {
        setMediaUrl(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMediaUrl('');
    };

    const fetchReviews = async (productId) => {
        try {
            const productReviews = await reviewsService.getReviewsByProduct(productId);
            if (Array.isArray(productReviews)) {
                const sortedReviews = productReviews.sort((a, b) => b.star - a.star);
                setReviews(sortedReviews);
            } else {
                setReviews([]);
            }
        } catch (error) {
            setReviews([]);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const productId = query.get('id');

        if (productId) {
            fetchReviews(productId);
        }
    }, [location]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const countReviewsByStar = (star) => {
        return reviews.filter((review) => review.star === star).length;
    };

    const calculateAverageStars = () => {
        if (reviews.length === 0) return 0;

        const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
        return (totalStars / reviews.length).toFixed(1);
    };

    const averageStars = calculateAverageStars();

    const renderStars = (average) => {
        const fullStars = Math.floor(average);
        const partialStar = average % 1;
        const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

        return (
            <div style={{ display: 'flex', gap: '5px' }}>
                {Array.from({ length: fullStars }).map((_, index) => (
                    <FontAwesomeIcon key={`full-${index}`} icon={solidStar} style={{ color: 'orange', fontSize: '25px' }} />
                ))}

                {partialStar > 0 && (
                    <div style={{ position: 'relative', width: '28px', height: '28px', overflow: 'hidden', marginTop: '-1px' }}>

                        <FontAwesomeIcon icon={regularStar} style={{ color: '#ccc', fontSize: '25px', position: 'absolute', width: '100%', height: '100%' }} />
                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                clipPath: `inset(0 ${100 - partialStar * 100}% 0 0)`,
                            }}
                        >
                            <FontAwesomeIcon icon={solidStar} style={{ color: 'orange', fontSize: '25px', width: '100%', height: '100%', marginBottom: '8px' }} />
                        </div>
                    </div>
                )}

                {Array.from({ length: emptyStars }).map((_, index) => (
                    <FontAwesomeIcon key={`empty-${index}`} icon={regularStar} style={{ color: '#ccc', fontSize: '25px' }} />
                ))}
            </div>
        );
    };


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const filteredReviews = reviews.filter((review) => {
        const hasMedia = reviewFiles.some(
            (file) => file.reviewId === review.id && (file.imageUrl || file.videoUrl)
        );

        const matchesStarFilter = selectedStar ? review.star === selectedStar : true;
        const matchesMediaFilter = showOnlyWithMedia ? hasMedia : true;

        return matchesStarFilter && matchesMediaFilter;
    });

    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <span style={{ color: '#555', marginRight: '10px', fontSize: '40px', fontWeight: 'bold' }}>
                {averageStars}
            </span>
            trên 5

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ color: 'orange', marginBottom: '10px', marginRight: '10px' }}>
                    {renderStars(averageStars)}
                </div>
                <div>
                    <button
                        onClick={() => setSelectedStar(null)}
                        style={{
                            marginRight: '5px',
                            padding: '5px 10px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            color: !selectedStar ? 'red' : '#000',
                        }}
                    >
                        Tất cả ({reviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map((star) => (
                        <button
                            key={star}
                            onClick={() => setSelectedStar(star)}
                            style={{
                                marginRight: '5px',
                                padding: '5px 10px',
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                border: selectedStar === star ? '1px solid red' : '1px solid #ccc',
                                color: selectedStar === star ? 'red' : '#000',
                            }}
                        >
                            {star} sao ({countReviewsByStar(star)})
                        </button>
                    ))}
                    <button
                        style={{
                            marginRight: '5px',
                            padding: '5px 10px',
                            backgroundColor: '#fff',
                            borderRadius: '5px',
                            border: showOnlyWithMedia ? '1px solid red' : '1px solid #ccc',
                            color: showOnlyWithMedia ? 'red' : '#000',
                        }}
                        onClick={() => setShowOnlyWithMedia(!showOnlyWithMedia)}
                    >
                        Có hình ảnh/video
                    </button>
                </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {currentReviews.map((review) => (
                    <li key={review.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '0 0 50px', textAlign: 'center', marginRight: '1px' }}>
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png"
                                    alt="user-icon"
                                    style={{ borderRadius: '50%', width: '60px', marginRight: '1px' }}
                                />
                            </div>

                            <div style={{ flex: '1' }}>
                                <strong style={{ fontSize: '18px' }}>{review.fullName}</strong>
                                <div style={{ color: 'orange', fontSize: '14px' }}>
                                    {renderStars(review.star)}
                                </div>

                                <p style={{ color: '#999', fontSize: '14px' }}>
                                    {formatDate(review.createdAt)} | Phân loại hàng: {review.color}, {review.size}
                                </p>

                                {(reviewFiles.some((file) => file.reviewId === review.id && (file.videoUrl || file.imageUrl))) && (
                                    <>
                                        <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '1px' }}>Hình ảnh và video:</p>
                                        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                                            {Array.from(new Set(reviewFiles.filter((file) => file.reviewId === review.id && file.videoUrl)
                                                .map((file) => file.videoUrl)))
                                                .map((videoUrl, index) => (
                                                    <div key={index} style={{ position: 'relative' }}>
                                                        <video
                                                            width="130"
                                                            height="130"
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
                                                                bottom: '60px',
                                                                left: '50px',
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
                                                            <i className="fas fa-play" style={{ color: 'white', fontSize: '16px' }}></i>
                                                        </div>
                                                    </div>
                                                ))}

                                            {reviewFiles.filter((file) => file.reviewId === review.id && file.imageUrl).map((file) => (
                                                <div key={file.id}>
                                                    {file.imageUrl && (
                                                        <img
                                                            src={file.imageUrl}
                                                            alt="Review"
                                                            style={{
                                                                width: '130px',
                                                                height: '130px',
                                                                borderRadius: '3px',
                                                                cursor: 'pointer',
                                                                objectFit: 'cover',
                                                            }}
                                                            onClick={() => handleOpen(file.imageUrl)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {review.comment && (
                                    <>
                                        <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '1px' }}>Bình luận:</p>
                                        <p style={{ fontSize: '16px', color: '#555', marginBottom: '1px' }}>{review.comment}</p>
                                    </>
                                )}
                                {review.adminFeedback !== null && (
                                    <button
                                        onClick={() => handleToggleExpand(review.id)}
                                        style={{
                                            marginTop: '1px',
                                            fontSize: '15px',
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            color: '#0285c7'
                                        }}
                                    >
                                        {expandedReviewId === review.id ? (
                                            <>
                                                <i className="fas fa-chevron-up" style={{ marginRight: '5px' }}></i>
                                                Ẩn
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-chevron-down" style={{ marginRight: '5px', fontWeight: 'bold' }}></i>
                                                Xem phản hồi
                                            </>
                                        )}
                                    </button>
                                )}
                                {expandedReviewId === review.id && (
                                    <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#FFFFE0' }}>
                                        <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '1px' }}>Phản hồi của người bán:</p>
                                        <p style={{ fontSize: '16px', marginTop: '1px', marginBottom: '3px' }}>{review.adminFeedback}</p>
                                    </div>
                                )}
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
                                                </video>
                                            ) : (
                                                <img src={mediaUrl} alt="Review Media" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            )
                                        ) : (
                                            <p>No media available</p>
                                        )}
                                    </Box>
                                </Modal>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>


            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: currentPage === 1 ? '#e0e0e0' : '#FFD333',
                        border: 'none',
                        borderRadius: '50%',
                        color: 'black',
                        fontSize: '18px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#FFD333')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = currentPage === 1 ? '#e0e0e0' : '#FFD333')}
                    onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
                    onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
                >
                    <FiChevronLeft style={{ fontSize: '20px' }} />
                </button>

                <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 15px',
                    color: '#333',
                    textAlign: 'center',
                    padding: '5px 10px',
                    backgroundColor: '#f7f7f7',
                    borderRadius: '25px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}>
                    Trang {currentPage} / {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#FFD333',
                        border: 'none',
                        borderRadius: '50%',
                        color: 'black',
                        fontSize: '18px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#FFD333')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = currentPage === totalPages ? '#e0e0e0' : '#FFD333')}
                    onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
                    onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
                >
                    <FiChevronRight style={{ fontSize: '20px' }} />
                </button>
            </div>


        </div>
    );
};
export default ReviewList;