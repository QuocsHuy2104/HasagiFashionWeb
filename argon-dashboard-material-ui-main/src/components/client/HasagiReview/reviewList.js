import React, { useEffect, useState } from 'react';
import reviewsService from 'services/ReviewsServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { Modal, Box } from '@mui/material';


const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedStar, setSelectedStar] = useState(null);
    const [open, setOpen] = useState(false);
    const [mediaUrl, setMediaUrl] = useState('');
    const [expandedReviewId, setExpandedReviewId] = useState(null);
    const [showOnlyWithMedia, setShowOnlyWithMedia] = useState(false);

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

    // Hàm fetchReviews
    const fetchReviews = async (productId) => {
        try {
            const productReviews = await reviewsService.getReviewsByProduct(productId);
            console.log('Fetched reviews for product:', productReviews);

            if (Array.isArray(productReviews)) {
                const sortedReviews = productReviews.sort((a, b) => b.star - a.star);
                setReviews(sortedReviews);
            } else {
                console.error('Expected an array but got:', productReviews);
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews for product:', error);
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

    // Format date in dd-mm-yyyy hh:mm
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




    return (
        <div>
            <span style={{ color: '#555', marginRight: '10px', fontSize: '40px', fontWeight: 'bold' }}>
                {averageStars}
            </span>trên 5

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
                            backgroundColor: '#fff', // Color remains the same when active
                            borderRadius: '5px',
                            border: showOnlyWithMedia ? '1px solid red' : '1px solid #ccc',
                            color: showOnlyWithMedia ? 'red' : '#000',
                        }}
                        onClick={() => setShowOnlyWithMedia(!showOnlyWithMedia)} // Toggle media filter
                    >
                        Có hình ảnh/video
                    </button>
                </div>
            </div>


            <ul style={{ listStyle: 'none', padding: 0 }}>
                {reviews
                    .filter((review) => (selectedStar ? review.star === selectedStar : true))
                    .filter((review) => {
                        const matchesStarFilter = selectedStar ? review.star === selectedStar : true;
                        const matchesMediaFilter = showOnlyWithMedia ? (review.imageUrl || review.videoUrl) : true;
                        return matchesStarFilter && matchesMediaFilter;
                    })

                    .map((review) => (
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
                                    <div style={{ color: 'orange', fontSize: '14px', fontSize: '14px !important' }}>
                                        {renderStars(review.star)}
                                    </div>

                                    <p style={{ color: '#999', fontSize: '14px' }}>
                                        {formatDate(review.createdAt)} | Phân loại hàng: {review.color}, {review.size}
                                    </p>
                                    {(review.imageUrl || review.videoUrl) && (
                                        <>
                                            <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '1px' }}>Hình ảnh và video:</p>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '1px', marginBottom: '10px' }}>
                                                {review.imageUrl && (
                                                    <img
                                                        src={review.imageUrl}
                                                        alt="Review"
                                                        style={{ maxWidth: '100px', height: 'auto', borderRadius: '5px', cursor: 'pointer' }}
                                                        onClick={() => handleOpen(review.imageUrl)}
                                                    />
                                                )}
                                                {review.videoUrl && (
                                                    <video
                                                        width="100"
                                                        height="100"
                                                        style={{ borderRadius: '5px', cursor: 'pointer' }}
                                                        onClick={() => handleOpen(review.videoUrl)}
                                                    >
                                                        <source src={review.videoUrl} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
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
                                            width: '80%',
                                            maxWidth: '600px',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            borderRadius: '5px',
                                            boxShadow: 24,
                                        }}>
                                            {mediaUrl.endsWith('.mp4') ? (
                                                <video width="100%" controls>
                                                    <source src={mediaUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img src={mediaUrl} alt="Review" style={{ width: '100%', height: 'auto', borderRadius: '5px' }} />
                                            )}
                                        </Box>
                                    </Modal>

                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default ReviewList;